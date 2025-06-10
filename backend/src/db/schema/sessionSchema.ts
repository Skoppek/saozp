import { integer, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { userSchema } from './userSchema';

export const sessionSchema = pgTable(
    'sessions',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        userId: integer('user_id')
            .references(() => userSchema.id)
            .notNull(),
        expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    }
);

export type NewSession = typeof sessionSchema.$inferInsert;
export type Session = typeof sessionSchema.$inferSelect;
