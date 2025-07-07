import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

let _pool: Pool | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

function initializeDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL must be set. Did you forget to provision a database?");
    throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
  }

  if (!_pool) {
    _pool = new Pool({ connectionString: process.env.DATABASE_URL });
    _db = drizzle({ client: _pool, schema });
    console.log("Database connection initialized");
  }
  
  return { pool: _pool, db: _db };
}

export function getDatabase() {
  if (!_db) {
    return initializeDatabase();
  }
  return { pool: _pool!, db: _db };
}

// For backward compatibility
export const pool = new Proxy({} as Pool, {
  get() {
    return getDatabase().pool;
  }
});

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(target, prop) {
    const { db } = getDatabase();
    return db[prop as keyof typeof db];
  }
});