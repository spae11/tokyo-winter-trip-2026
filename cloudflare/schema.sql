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

CREATE TABLE IF NOT EXISTS google_oauth_states (
  state_hash TEXT PRIMARY KEY,
  room_id TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS google_photo_auth (
  room_id TEXT PRIMARY KEY,
  refresh_token_enc TEXT NOT NULL,
  scopes TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS google_photo_items (
  room_id TEXT NOT NULL,
  local_id TEXT NOT NULL,
  google_media_id TEXT NOT NULL,
  product_url TEXT,
  filename TEXT,
  mime_type TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(room_id, local_id)
);
CREATE INDEX IF NOT EXISTS idx_google_photo_items_room ON google_photo_items(room_id);

CREATE TABLE IF NOT EXISTS google_drive_folders (
  room_id TEXT PRIMARY KEY,
  folder_id TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS google_drive_items (
  room_id TEXT NOT NULL,
  local_id TEXT NOT NULL,
  google_file_id TEXT NOT NULL,
  name TEXT NOT NULL,
  mime_type TEXT NOT NULL DEFAULT 'application/pdf',
  web_view_link TEXT,
  trip TEXT,
  category TEXT,
  size_bytes INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(room_id, local_id)
);
CREATE INDEX IF NOT EXISTS idx_google_drive_items_room ON google_drive_items(room_id);
