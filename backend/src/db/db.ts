import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

pool.on('error', (err) => {
  console.log('Unexpected error on the database client:', err);
});

export const db = drizzle({ client: pool });

try {
  await db.execute('select 1');
} catch {
  console.error("[ERROR] | " + new Date().toLocaleString() + " | Failed to connect to DB\n" + `${process.env.POSTGRES_URL}`);
  process.exit(1);
}