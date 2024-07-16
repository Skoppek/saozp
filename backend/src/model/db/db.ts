import { drizzle } from 'drizzle-orm/node-postgres';
import {Client} from 'pg';
import schema from './schema';

const connectionString = process.env.DB_CONNECTION_STRING;

if (!connectionString) {
    throw new Error('Connection string not found!');
}

export const client = new Client({ connectionString });
await client.connect();

export const db = drizzle(client, { schema });
