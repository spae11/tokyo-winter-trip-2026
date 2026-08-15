CREATE TABLE IF NOT EXISTS sync_rooms (
  room_id TEXT PRIMARY KEY,
  payload TEXT NOT NULL DEFAULT '{}',
  version INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sync_devices (
  token_hash TEXT PRIMARY KEY,
  room_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_sync_devices_room ON sync_devices(room_id);

CREATE TABLE IF NOT EXISTS sync_pair_codes (
  code TEXT PRIMARY KEY,
  room_id TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_sync_pair_codes_room ON sync_pair_codes(room_id);

CREATE TABLE IF NOT EXISTS sync_recovery (
  room_id TEXT PRIMARY KEY,
  recovery_code TEXT UNIQUE NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trip_state (
  trip TEXT PRIMARY KEY,
  payload TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
