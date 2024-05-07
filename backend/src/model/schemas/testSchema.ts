import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { submissionSchema } from './submissionSchema';

export const testSchema = pgTable('tests', {
    token: varchar('token', { length: 40 }).primaryKey(),
    submissionId: integer('submission_id')
        .references(() => submissionSchema.id)
        .notNull(),
});

export type NewTest = typeof testSchema.$inferInsert;
export type Test = typeof testSchema.$inferSelect;
