import { pgTable } from 'drizzle-orm/pg-core/table';
import {
    boolean,
    integer,
    json,
    serial,
    text,
    varchar,
} from 'drizzle-orm/pg-core/columns';
import { userSchema } from './userSchema';

export const problemSchema = pgTable('problems', {
    id: serial('id').primaryKey(),
    creatorId: integer('creator_id')
        .references(() => userSchema.id)
        .notNull(),
    name: varchar('name', { length: 128 }).notNull(),
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
    isContestsOnly: boolean('contests_only').notNull().default(false),
    isDeactivated: boolean('deactivated').notNull().default(false),
});

export type NewProblem = typeof problemSchema.$inferInsert;
export type Problem = typeof problemSchema.$inferSelect;
