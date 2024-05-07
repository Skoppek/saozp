import {
    index,
    integer,
    pgTable,
    serial,
    text,
    timestamp,
} from 'drizzle-orm/pg-core';
import { problemSchema } from './problemSchema';
import { userSchema } from './userSchema';

export const submissionSchema = pgTable(
    'submissions',
    {
        id: serial('id').primaryKey(),
        problemId: integer('problemId')
            .references(() => problemSchema.id)
            .notNull(),
        userId: integer('userId')
            .references(() => userSchema.id)
            .notNull(),
        code: text('code').notNull(),
        createdAt: timestamp('created_at').defaultNow(),
    },
    (submissionSchema) => ({
        userIdIdx: index('submission_user_id_idx').on(submissionSchema.userId),
    }),
);

export type NewSubmission = typeof submissionSchema.$inferInsert;
export type Submission = typeof submissionSchema.$inferSelect;
