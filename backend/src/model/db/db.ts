import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import schema from './schema';

const connectionString = process.env.DB_CONNECTION_STRING;

if (!connectionString) {
    throw new Error('Connection string not found!');
}

export const queryClient = postgres(connectionString);

export const db = drizzle(queryClient, { schema });
