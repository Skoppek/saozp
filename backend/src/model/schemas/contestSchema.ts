import { pgTable, timestamp } from 'drizzle-orm/pg-core';
import { integer, serial, text, varchar } from 'drizzle-orm/pg-core/columns';
import { userSchema } from './userSchema';

export const contestSchema = pgTable('contests', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 128 }).notNull(),
    description: text('description'),
    owner: integer('owner_id')
        .references(() => userSchema.id)
        .notNull(),
    startDate: timestamp('starts', { withTimezone: true }).notNull(),
    endDate: timestamp('ends', { withTimezone: true }).notNull(),
});

export type NewContest = typeof contestSchema.$inferInsert;
export type Contest = typeof contestSchema.$inferSelect;
