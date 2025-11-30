import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'dev.db');
const db = new Database(dbPath);

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS calls (
    id TEXT PRIMARY KEY,
    orgId TEXT,
    phoneNumberId TEXT,
    type TEXT,
    status TEXT,
    endedReason TEXT,
    transcript TEXT,
    recordingUrl TEXT,
    stereoRecordingUrl TEXT,
    summary TEXT,
    createdAt TEXT,
    updatedAt TEXT,
    startedAt TEXT,
    endedAt TEXT,
    cost REAL,
    duration REAL,
    customerNumber TEXT,
    customerName TEXT,
    metadata TEXT,
    analysis TEXT,
    costBreakdown TEXT
  );
  
  CREATE INDEX IF NOT EXISTS idx_calls_createdAt ON calls(createdAt);
  CREATE INDEX IF NOT EXISTS idx_calls_status ON calls(status);
`);

export default db;
