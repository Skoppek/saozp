import {
    integer,
    json,
    pgTable,
    serial,
    text,
    varchar,
} from 'drizzle-orm/pg-core';
import { users } from './userSchema';

export const problems = pgTable('problems', {
    id: serial('id').primaryKey(),
    creator: integer('creator_id')
        .references(() => users.id)
        .notNull(),
    name: varchar('name', { length: 128 }).notNull(),
    description: varchar('description', { length: 512 }).notNull(),
    prompt: text('prompt').notNull(),
    languageId: integer('language_id').notNull(),
    tests: json('tests')
        .$type<
            {
                input: string;
                expected: string;
            }[]
        >()
        .notNull(),
    baseCode: text('base_code').notNull(),
});

export type NewProblem = typeof problems.$inferInsert;
export type Problem = typeof problems.$inferSelect;
