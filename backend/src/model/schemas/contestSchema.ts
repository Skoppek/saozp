import { pgTable } from 'drizzle-orm/pg-core';
import { integer, serial, text, varchar } from 'drizzle-orm/pg-core/columns';
import { userSchema } from './userSchema';

export const contestSchema = pgTable('contests', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 128 }).notNull(),
    description: text('description').notNull(),
    owner: integer('owner_id')
        .references(() => userSchema.id)
        .notNull(),
});

export type NewContest = typeof contestSchema.$inferInsert;
export type Contest = typeof contestSchema.$inferSelect;
