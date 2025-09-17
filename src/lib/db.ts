import Database from "better-sqlite3";

const db = new Database("data.sqlite");

// Create table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS firebase_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL
  )
`).run();

export default db;
