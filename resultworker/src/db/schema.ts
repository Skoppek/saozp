import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

export const testSchema = pgTable('tests', {
    token: varchar({ length: 40 }),
    submission_id: integer(),
});

export type Test = typeof testSchema.$inferSelect;