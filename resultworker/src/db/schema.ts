import { integer, json, pgTable, serial, text, uuid, varchar } from 'drizzle-orm/pg-core';

export const testSchema = pgTable('tests', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    token: varchar({ length: 40 }),
    submission_id: integer(),
});

export type Test = typeof testSchema.$inferSelect;

export const submissionSchema = pgTable(
    'submissions',
    {
        id: serial('id').primaryKey(),
        problemId: integer('problem_id').notNull(),
        code: text('code').notNull().notNull(),
    }
);

export type Submission = typeof submissionSchema.$inferSelect;

export const problemSchema = pgTable('problems', {
    id: serial('id').primaryKey(),
    languageId: integer('language_id').notNull(),
    tests: json('tests')
        .$type<
            {
                input: string;
                expected: string;
            }[]
        >()
        .notNull(),
});

export type Problem = typeof problemSchema.$inferSelect;
