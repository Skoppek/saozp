import { index, integer, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { userSchema } from './userSchema';

export const sessionSchema = pgTable(
    'sessions',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        userId: integer('user_id')
            .references(() => userSchema.id)
            .notNull(),
        expiresAt: timestamp('expiresAt', { withTimezone: true }).notNull(),
    },
    (sessionSchema) => ({
        sessionIdIdx: index('session_id_idx').on(sessionSchema.id),
    }),
);

export type NewSession = typeof sessionSchema.$inferInsert;
export type Session = typeof sessionSchema.$inferSelect;
