import {
    boolean,
    index,
    integer,
    pgTable,
    serial,
    text,
    timestamp,
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
        isCommit: boolean('is_commit').notNull().default(false),
        stageId: integer('stage_id').references(() => stageSchema.id, {
            onDelete: 'set null',
        }),
        rerun: timestamp('rerun'),
    },
    (submissionSchema) => ({
        userIdIdx: index('submission_user_id_idx').on(submissionSchema.userId),
    }),
);

export type NewSubmission = typeof submissionSchema.$inferInsert;
export type Submission = typeof submissionSchema.$inferSelect;
