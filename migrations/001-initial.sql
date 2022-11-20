--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS stakepool (
  id TEXT PRIMARY KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS params (
  id TEXT PRIMARY KEY NOT NULL,
  cost INTEGER, -- uint64
  margin TEXT, -- fraction
  metadata_hash TEXT, -- nullable hash of the metadata
  metadata_url TEXT, -- url to fetch metadata from
  owners TEXT, -- `;` separated list of owners
  pledge INTEGER, -- uint64
  relays TEXT, -- JSON structure of relays either with hostname or IPs
  reward_account TEXT,
  vrf TEXT,
  
  CONSTRAINT fk_params_pool FOREIGN KEY (id) REFERENCES stakepool(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS metadata (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT,
  ticker TEXT,
  description TEXT,
  homepage TEXT,
  extended TEXT,
  
  CONSTRAINT fk_metadata_pool FOREIGN KEY (id) REFERENCES stakepool(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS extended_metadata (
  id TEXT PRIMARY KEY NOT NULL,
  url_png_logo TEXT,
  url_png_icon_64x64 TEXT,
  location TEXT,
  about_server TEXT,
  about_company TEXT,
  about_me TEXT,
  social_twitter TEXT,
  social_telegram TEXT,
  saturated_recommend TEXT, -- list of IDs separated by `;`
  
  CONSTRAINT fk_emetadata_pool FOREIGN KEY (id) REFERENCES stakepool(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reward_info (
  id TEXT PRIMARY KEY NOT NULL,
  stake INTEGER, -- uint64
  owner_stake INTEGER, -- uint64
  performance NUMERIC,
  
  CONSTRAINT fk_reward_info_pool FOREIGN KEY (id) REFERENCES stakepool(id) ON DELETE CASCADE
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE reward_info;
DROP TABLE extended_metadata;
DROP TABLE metadata;
DROP TABLE params;
DROP TABLE stakepool;