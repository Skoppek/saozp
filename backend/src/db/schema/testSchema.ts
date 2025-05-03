import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { submissionSchema } from './submissionSchema';

export const testSchema = pgTable('tests', {
    token: varchar('token', { length: 40 }),
    submissionId: integer('submission_id')
        .references(() => submissionSchema.id, { onDelete: 'cascade' }),
});

export type NewTest = typeof testSchema.$inferInsert;
export type Test = typeof testSchema.$inferSelect;
