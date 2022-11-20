import { safeJSON, Schema } from '@cardano-ogmios/client';
import { StateQueryClient } from '@cardano-ogmios/client/dist/StateQuery';
import axios from 'axios';
import { difference, indexBy, mapKeys, prop } from 'rambdax';
import { Database } from 'sqlite';
import { logger } from '../logger';
import { bechIdToHex } from './utils';

export async function updateStakepools(stateQuery: StateQueryClient, db: Database) {
  const stakePools = (await stateQuery.poolIds()).map((bechPoolId) => bechIdToHex(bechPoolId));
  const dbPools = await db.all<{ id: string }[]>('SELECT id FROM stakepool');
  const dbPoolIds = dbPools.map((row) => row.id);

  await reconcileExistingPools(dbPoolIds, stakePools, db);

  const { changedPoolMetadata } = await upsertParams(stakePools, stateQuery, db);

  await upsertMetadata(changedPoolMetadata, db);

  logger.debug('Fetching current stake information');
  const distribution = await stateQuery.stakeDistribution();
  logger.debug(
    { peek: Object.entries(distribution).slice(0, 10), count: Object.keys(distribution).length },
    'Fetched current stake information'
  );

  await upsertRewardInfo(stateQuery, db);
}

async function reconcileExistingPools(dbPools: string[], stakePools: string[], db: Database) {
  const removedPools = difference(dbPools, stakePools);
  const newPools = difference(stakePools, dbPools);

  logger.debug(
    {
      dbCount: dbPools.length,
      dbPeek: dbPools.slice(0, 10),
      blockchainCount: stakePools.length,
      blockchainPeek: stakePools.slice(0, 10),
    },
    'Reconciling stakepools between db & blockchain'
  );

  // TODO do we really want to remove old pools?

  const deleteStmt = await db.prepare('DELETE FROM stakepool WHERE id = ?');
  try {
    for (const poolId of removedPools) {
      await deleteStmt.run(poolId);
    }
  } finally {
    await deleteStmt.finalize();
  }

  logger.info({ poolCount: removedPools.length }, 'Removed unused stakepools');

  const newStmt = await db.prepare('INSERT OR REPLACE INTO stakepool (id) VALUES (?)');
  try {
    for (const poolId of newPools) {
      await newStmt.run(poolId);
    }
  } finally {
    await newStmt.finalize();
  }

  logger.info({ poolCount: newPools.length }, 'Inserted new stakepools');
}

type PoolIdWithMetadata = { id: string; metadataHash: string | null; metadataUrl: string | null };

async function upsertParams(stakePools: string[], stateQuery: StateQueryClient, db: Database) {
  logger.debug('Starting fetching pool paramters');
  const paramsByPoolId = mapKeys<Schema.PoolParameters, { [key: string]: Schema.PoolParameters }>(
    bechIdToHex,
    await stateQuery.poolParameters(stakePools)
  );
  logger.debug('Pool parameters fetched');

  // fetch existing db params to detect if metadata changed
  const dbParams = indexBy(
    prop('id'),
    await db.all<PoolIdWithMetadata[]>(
      'SELECT id, metadata_hash as "metadataHash", metadata_url as "metdataUrl" from params'
    )
  );

  const changedPoolMetadata = Object.entries(paramsByPoolId)
    .filter(
      ([poolId, params]) =>
        params.metadata?.hash &&
        params.metadata?.url &&
        dbParams[poolId]?.metadataHash !== params.metadata?.hash
    )
    .map(([poolId, params]) => ({
      id: poolId,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      metadataHash: params.metadata!.hash,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      metadataUrl: params.metadata!.url,
    }));

  const upsertParamsStmt = await db.prepare(`
    INSERT OR REPLACE INTO params
      (id, cost, margin, metadata_hash, metadata_url, owners, pledge, relays, reward_account, vrf)
    VALUES ($id, CAST($cost AS INT), $margin, $metadataHash, $metadataUrl, $owners, CAST($pledge AS INT), $relays, $rewardAccount, $vrf)
  `);
  try {
    //serialize so errors are detected
    for (const [poolId, params] of Object.entries(paramsByPoolId)) {
      await upsertParamsStmt.run({
        $id: poolId,
        $cost: params.cost.toString(),
        $margin: params.margin,
        $metadataHash: params.metadata?.hash || null,
        $metadataUrl: params.metadata?.url || null,
        $owners: params.owners.join(';'),
        $pledge: params.pledge.toString(),
        $relays: safeJSON.stringify(params.relays),
        $rewardAccount: params.rewardAccount,
        $vrf: params.vrf,
      });
    }
  } catch (err) {
    logger.error({ err }, 'Unable to upsert params');
    throw err;
  } finally {
    await upsertParamsStmt.finalize();
  }
  logger.info({ paramCount: Object.keys(paramsByPoolId).length }, 'New pool parameters upserted.');

  return {
    changedPoolMetadata,
  };
}

async function upsertMetadata(pools: PoolIdWithMetadata[], db: Database) {
  logger.debug({ count: pools.length }, 'Fetching metadata information for changed pools');

  // go through all in parallel
  const results = await Promise.allSettled(
    pools.map(async (pool) => {
      if (!pool.metadataUrl) {
        return;
      }
      try {
        const result = await axios.get(pool.metadataUrl);
        // NOTE: most do not follow the standard: https://cips.cardano.org/cips/cip6/
        // so parsing what's there 🤷
        const { name, ticker, description, homepage, extended } = result.data;
        await db.run(
          `
            INSERT OR REPLACE INTO metadata (id, name, ticker, description, homepage, extended)
            VALUES ($id, $name, $ticker, $description, $homepage, $extended)`,
          {
            $id: pool.id,
            $name: name || null,
            $ticker: ticker || null,
            $description: description || null,
            $homepage: homepage || null,
            $extended: extended || null,
          }
        );

        if (!extended) {
          return;
        }

        const extendedResult = await axios.get(extended);
        const { info, 'when-saturated-then-recommend': saturatedRecommend } = extendedResult.data;
        await db.run(
          `
          INSERT OR REPLACE INTO extended_metadata
            (id, url_png_logo, url_png_icon_64x64, location,
              about_server, about_company, about_me,
              social_twitter, social_telegram, saturated_recommend)
          VALUES ($id, $urlPngLogo, $urlPngIcon, $location, $aboutServer, $aboutCompany, $aboutMe, $twitter, $telegram, $recommend)
        `,
          {
            $id: pool.id,
            // TODO do some sanitization over these urls
            $urlPngLogo: info?.['url_png_logo'] || null,
            $urlPngIcon: info?.['url_png_icon_64x64'] || null,
            $location: info?.location || null,
            $aboutServer: info?.about?.server || null,
            $aboutCompany: info?.about?.company || null,
            $aboutMe: info?.about?.me || null,
            $twitter: info?.social?.twitter_handle || null,
            $telegram: info?.social?.telegram_handle || null,
            $recommend: saturatedRecommend?.join(';') || null,
          }
        );
      } catch (err) {
        logger.error({ err, id: pool.id }, 'Unable to get metadata for pool');
        throw err;
      }
    })
  );

  logger.debug(
    {
      failed: results.filter((result) => result.status === 'rejected').length,
      success: results.filter((result) => result.status === 'fulfilled').length,
    },
    'Finished getting pool metadata'
  );
}

async function upsertRewardInfo(stateQuery: StateQueryClient, db: Database) {
  logger.debug('Fetching pool reward information');
  const provenance = await stateQuery.rewardsProvenanceNew();

  logger.debug(
    { poolCount: Object.keys(provenance.pools).length },
    'Successfully fetched pool reward information'
  );

  const upsertRewardInfoStmt = await db.prepare(`
    INSERT OR REPLACE INTO reward_info (id, stake, owner_stake, performance)
    VALUES ($id, $stake, $ownerStake, $performance)
  `);
  try {
    await Promise.all(
      Object.entries(provenance.pools).map(([bechPoolId, rewardInfo]) =>
        upsertRewardInfoStmt.run({
          $id: bechIdToHex(bechPoolId),
          $stake: rewardInfo.stake.toString(),
          $ownerStake: rewardInfo.ownerStake.toString(),
          $performance: rewardInfo.approximatePerformance,
        })
      )
    );
  } finally {
    upsertRewardInfoStmt.finalize();
  }
  logger.info('Upserted pool reward information');
}
