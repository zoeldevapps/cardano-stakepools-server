import { Job, RecurrenceRule, scheduleJob } from 'node-schedule';
import { Database } from 'sqlite';
import { initializeDb } from './db';
import { logger } from './logger';
import { updateStakepools } from './ogmios/stakepools';
import { getStateQueryClient } from './ogmios/stateQuery';
import { startServer } from './server';

function setupCleanup({ db, updateJob }: { db: Database; updateJob: Job }) {
  process.on('exit', () => {
    updateJob.cancel();
    db.close();
  });
}

async function schedulUpdateStakepools(db: Database) {
  const rule = new RecurrenceRule();
  rule.hour = [21, 3, 9, 15]; // every 6 hours
  rule.minute = 50;
  rule.second = 0;
  rule.tz = 'Etc/UTC';

  const job = scheduleJob('syncPools', rule, async (fireDate) => {
    logger.info({ fireDate: fireDate?.toISOString() }, 'Start stakepools sync job');
    return updateStakepools(await getStateQueryClient(), db);
  });

  // if the db is empty, immediately fill it
  const res = await db.get<{ count: number }>('SELECT COUNT(*) as "count" FROM stakepool');
  if (!res?.count) {
    job.invoke();
  }

  return job;
}

(async () => {
  try {
    const stateQuery = await getStateQueryClient();
    const params = await stateQuery.genesisConfig();
    const tip = await stateQuery.chainTip();
    logger.info({ network: params.network, tip }, 'Connected to ogmios');

    const db = await initializeDb();
    await db.migrate();

    const updateJob = await schedulUpdateStakepools(db);

    setupCleanup({ db, updateJob });

    await startServer(db);
  } catch (err) {
    logger.error({ err }, 'Unexpected error occured during initialization');
    process.exit(1);
  }
})();
