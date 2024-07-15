import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import schema from './schema';

const connectionString = process.env.DB_CONNECTION_STRING;

if (!connectionString) {
    throw new Error('Connection string not found!');
}

export const client = new Pool({ connectionString, max: 1 });
await client.connect();

export const db = drizzle(client, { schema });
