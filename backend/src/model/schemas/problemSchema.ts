import {
    boolean,
    integer,
    json,
    pgTable,
    serial,
    text,
    varchar,
} from 'drizzle-orm/pg-core';
import { userSchema } from './userSchema';

export const problemSchema = pgTable('problems', {
    id: serial('id').primaryKey(),
    creator: integer('creator_id')
        .references(() => userSchema.id)
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
    isDeactivated: boolean('deactivated').notNull().default(false),
});

export type NewProblem = typeof problemSchema.$inferInsert;
export type Problem = typeof problemSchema.$inferSelect;
