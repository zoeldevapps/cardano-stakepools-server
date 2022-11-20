import { IResolvers, MercuriusLoaders } from 'mercurius';
import { anyTrue } from 'rambdax';
import { z } from 'zod';
import * as DbSchema from '../db';

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

function getIndexCursor(index: number) {
  return Buffer.from(String(index)).toString('base64');
}

export const resolvers: IResolvers = {
  Query: {
    async stakepool(_root, { id }, _ctx, _info) {
      return {
        id,
      };
    },
    async stakepools(_root, { first = DEFAULT_PAGE_SIZE, after = '' }, ctx, _info) {
      // const poolIds = await ctx.stateQueryClient.poolIds();
      let offset = 0;
      if (after) {
        offset = parseInt(Buffer.from(after, 'base64').toString()) + 1;
      }
      const limit = Math.max(0, Math.min(MAX_PAGE_SIZE, first || DEFAULT_PAGE_SIZE));

      const [pools, poolCount] = await Promise.all([
        ctx.db.all<{ id: string }[]>(
          `
        SELECT id FROM stakepool
        ORDER BY id ASC
        LIMIT $limit OFFSET $offset
      `,
          { $offset: offset, $limit: limit }
        ),
        ctx.db
          .get<{ count: number }>(`SELECT COUNT(*) as count FROM stakepool`)
          .then((res) => res?.count ?? 0),
      ]);

      return {
        edges: pools.map((pool, index) => ({
          node: { id: pool.id },
          cursor: getIndexCursor(index + offset),
        })),
        pageInfo: {
          endCursor: getIndexCursor(offset + Math.max(0, limit - 1)),
          hasNextPage: offset + limit < poolCount,
        },
      };
    },
  },
  Relay: {
    resolveType(relay) {
      return 'hostname' in relay ? 'RelayByName' : 'RelayByAddress';
    },
  },
};

export const loaders: MercuriusLoaders = {
  Stakepool: {
    async parameters(queries, ctx) {
      return Promise.all(
        queries.map(async ({ obj }) => {
          const poolParams = z.optional(DbSchema.params).parse(
            await ctx.db.get(
              `SELECT
                id,
                CAST(cost AS TEXT) as cost,
                margin,
                metadata_hash,
                metadata_url,
                owners,
                CAST(pledge AS TEXT) as pledge,
                relays,
                reward_account,
                vrf
              FROM params
              WHERE id = $id`,
              {
                $id: obj.id,
              }
            )
          );
          if (!poolParams) {
            return null;
          }

          return {
            cost: poolParams.cost.toString(),
            margin: poolParams.margin,
            metadataUrl: poolParams.metadata_url,
            metadataHash: poolParams.metadata_hash,
            owners: poolParams.owners,
            pledge: poolParams.pledge.toString(),
            relays: poolParams.relays,
            rewardAccount: poolParams.reward_account,
            vrf: poolParams.vrf,
          };
        })
      );
    },

    rewardInfo(queries, ctx) {
      return Promise.all(
        queries.map(async ({ obj }) => {
          const rewardInfo = z.optional(DbSchema.rewardInfo).parse(
            await ctx.db.get(
              `SELECT
                id,
                CAST(stake AS TEXT) as stake,
                CAST(owner_stake AS TEXT) as owner_stake,
                performance
              FROM reward_info WHERE id = $id`,
              { $id: obj.id }
            )
          );
          if (!rewardInfo) {
            return null;
          }

          return {
            stake: rewardInfo.stake?.toString(),
            ownerStake: rewardInfo.owner_stake?.toString(),
            performance: rewardInfo.performance,
          };
        })
      );
    },

    metadata(queries, ctx) {
      return Promise.all(
        queries.map(async ({ obj }) => {
          const metadata = z.optional(DbSchema.metadata).parse(
            await ctx.db.get(
              `SELECT
                id,
                name,
                ticker,
                description,
                extended,
                homepage
              FROM metadata WHERE id = $id`,
              { $id: obj.id }
            )
          );
          if (!metadata) {
            return null;
          }

          return {
            name: metadata.name,
            ticker: metadata.ticker,
            description: metadata.description,
            homepage: metadata.homepage,
            extendedUrl: metadata.extended,
          };
        })
      );
    },

    extendedMetadata(queries, ctx) {
      return Promise.all(
        queries.map(async ({ obj }) => {
          const extendedMetadata = z.optional(DbSchema.extendedMetadata).parse(
            await ctx.db.get(
              `SELECT
                id,
                url_png_logo,
                url_png_icon_64x64,
                location,
                about_server,
                about_company,
                about_me,
                social_twitter,
                social_telegram,
                saturated_recommend
              FROM extended_metadata WHERE id = $id`,
              { $id: obj.id }
            )
          );
          if (!extendedMetadata) {
            return null;
          }

          const { about_me, about_company, about_server } = extendedMetadata;
          const { social_twitter, social_telegram } = extendedMetadata;

          return {
            urlPngLogo: extendedMetadata.url_png_logo,
            urlPngIcon64: extendedMetadata.url_png_icon_64x64,
            location: extendedMetadata.location,
            about: anyTrue(about_me, about_company, about_server)
              ? {
                  me: about_me,
                  company: about_company,
                  server: about_server,
                }
              : null,
            social: anyTrue(social_telegram, social_twitter)
              ? {
                  twitter: social_twitter,
                  social_telegram: social_telegram,
                }
              : null,
          };
        })
      );
    },
  },
};
