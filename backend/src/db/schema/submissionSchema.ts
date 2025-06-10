import {
    integer,
    pgTable,
    serial,
    text,
    timestamp,
    varchar,
} from 'drizzle-orm/pg-core';
import { problemSchema } from './problemSchema';
import { userSchema } from './userSchema';
import { stageSchema } from './stageSchema';

export const submissionSchema = pgTable(
    'submissions',
    {
        id: serial('id').primaryKey(),
        problemId: integer('problem_id')
            .references(() => problemSchema.id)
            .notNull(),
        userId: integer('user_id')
            .references(() => userSchema.id)
            .notNull(),
        code: text('code').notNull(),
        createdAt: timestamp('created_at').defaultNow(),
        stageId: integer('stage_id').references(() => stageSchema.id, {
            onDelete: 'set null',
        }),
        rerun: timestamp('rerun'),
        ip: varchar('ip', { length: 64 }),
    }
);

export type NewSubmission = typeof submissionSchema.$inferInsert;
export type Submission = typeof submissionSchema.$inferSelect;
