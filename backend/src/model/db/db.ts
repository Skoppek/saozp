import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import schema from './schema';

// const connectionString = process.env.PSQL_CONNECTION_STRING;
const connectionString = 'reee';

if (!connectionString) {
    throw new Error('Connection string not found!');
}

export const queryClient = postgres(connectionString);

export const db = drizzle(queryClient, { schema });
