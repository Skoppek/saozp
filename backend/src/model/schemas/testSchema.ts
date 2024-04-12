import { integer, json, pgTable, varchar } from 'drizzle-orm/pg-core';
import { submissions } from './submissionSchema';

export const tests = pgTable('tests', {
    token: varchar('token', { length: 40 }).primaryKey(),
    submissionId: integer('submission_id')
        .references(() => submissions.id)
        .notNull(),
    input: json('input').$type<string>().notNull(),
    expected: json('expected').$type<string>().notNull(),
});

export type NewTest = typeof tests.$inferInsert;
export type Test = typeof tests.$inferSelect;
