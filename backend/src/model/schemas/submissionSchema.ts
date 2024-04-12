import {
    index,
    integer,
    pgTable,
    serial,
    text,
    timestamp,
} from 'drizzle-orm/pg-core';
import { problems } from './problemSchema';
import { users } from './userSchema';

export const submissions = pgTable(
    'submissions',
    {
        id: serial('id').primaryKey(),
        problemId: integer('problemId')
            .references(() => problems.id)
            .notNull(),
        userId: integer('userId')
            .references(() => users.id)
            .notNull(),
        code: text('code').notNull(),
        createdAt: timestamp('created_at').defaultNow(),
    },
    (submissions) => ({
        userIdIdx: index('submission_user_id_idx').on(submissions.userId),
    }),
);

export type NewSubmission = typeof submissions.$inferInsert;
export type Submission = typeof submissions.$inferSelect;
