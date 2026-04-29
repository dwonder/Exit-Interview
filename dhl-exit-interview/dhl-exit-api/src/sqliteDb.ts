// dhl-exit-api/src/sqliteDb.ts
import path from "path";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

let db: Database | null = null;

export async function getDb(): Promise<Database> {
  if (db) return db;

  // Use project root /data/exit_interviews.db
  const dbPath = path.join(process.cwd(), "data", "exit_interviews.db");

  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS ExitInterviews (
      Id TEXT PRIMARY KEY,
      EmployeeId TEXT NOT NULL,
      EmployeeName TEXT NOT NULL,
      Email TEXT,
      Manager TEXT NOT NULL,
      Position TEXT NOT NULL,
      FunctionName TEXT,
      Department TEXT,
      Grade TEXT NOT NULL,
      Location TEXT,
      LengthOfService TEXT,
      Age TEXT,
      SeparationDate TEXT NOT NULL,
      PrimaryReason TEXT NOT NULL,
      SecondaryReason TEXT,
      TertiaryReason TEXT,
      SingleTriggerEvent INTEGER,
      SingleTriggerExplanation TEXT,
      Preventable INTEGER,
      PreventableExplanation TEXT,
      Suggestions TEXT NOT NULL,
      WouldRecommend INTEGER,
      AcceptedAnotherJob INTEGER,
      NewEmployer TEXT,
      NewJobTitle TEXT,
      NewJobLocation TEXT,
      HowFoundJob TEXT,
      HowLongLooking TEXT,
      CreatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return db;
}
