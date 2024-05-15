import 'dotenv/config';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db, queryClient } from './db';

await migrate(db, { migrationsFolder: './drizzle' });

await queryClient.end();
