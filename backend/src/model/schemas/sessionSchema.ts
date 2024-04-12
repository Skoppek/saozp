import { index, integer, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './userSchema';

export const sessions = pgTable(
    'sessions',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        userId: integer('user_id').references(() => users.id),
        expiresAt: timestamp('expiresAt', { withTimezone: true }).notNull(),
    },
    (sessions) => ({
        sessionIdIdx: index('session_id_idx').on(sessions.id),
    }),
);

export type NewSession = typeof sessions.$inferInsert;
export type Session = typeof sessions.$inferSelect;
