import { integer, pgTable } from 'drizzle-orm/pg-core';
import { serial, varchar } from 'drizzle-orm/pg-core/columns';
import { userSchema } from './userSchema';

export const packageSchema = pgTable('package', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 128 }).notNull(),
    owner: integer('owner_id')
        .references(() => userSchema.id)
        .notNull(),
});

export type NewPackage = typeof packageSchema.$inferInsert;
