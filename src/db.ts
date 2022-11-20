import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { z } from 'zod';
import { options } from './options';
import { safeJSON, Schema } from '@cardano-ogmios/client';

export function initializeDb() {
  return open({
    filename: options.db,
    driver: sqlite3.cached.Database,
  });
}

// sqlite3 doesn't support bigint directly
// so all of them are cast to string, then the zod transform is used to convert back
const dbBigInt = z.string().transform((p) => BigInt(p));

export const params = z.object({
  id: z.string(),
  cost: dbBigInt,
  margin: z.string(),
  metadata_hash: z.string().nullable(),
  metadata_url: z.string().url().nullable(),
  owners: z.string().transform((arr) => arr.split(';')),
  pledge: dbBigInt,
  relays: z.string().transform((relays) => safeJSON.parse(relays) as Schema.Relay[]),
  reward_account: z.string(),
  vrf: z.string(),
});
export type Params = z.infer<typeof params>;

export const metadata = z.object({
  id: z.string(),
  name: z.string().nullable(),
  ticker: z.string().nullable(),
  description: z.string().nullable(),
  homepage: z.string().url().nullable(),
  extended: z.string().url().nullable(),
});
export type Metdata = z.infer<typeof metadata>;

export const extendedMetadata = z.object({
  id: z.string(),
  url_png_logo: z.string().url().nullable(),
  url_png_icon_64x64: z.string().nullable(),
  location: z.string().nullable(),
  about_server: z.string().nullable(),
  about_company: z.string().nullable(),
  about_me: z.string().nullable(),
  social_twitter: z.string().nullable(),
  social_telegram: z.string().nullable(),
  saturated_recommend: z
    .string()
    .transform((arr) => arr.split(';'))
    .nullable(),
});

export const rewardInfo = z.object({
  id: z.string(),
  stake: dbBigInt,
  owner_stake: dbBigInt,
  performance: z.number(),
});
