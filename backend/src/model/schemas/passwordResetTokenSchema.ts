import { char, integer, pgTable, timestamp } from 'drizzle-orm/pg-core';
import { userSchema } from './userSchema';

export const passwordResetTokenSchema = pgTable('password_reset_token', {
    userId: integer('user_id')
        .references(() => userSchema.id)
        .primaryKey(),
    token: char('token', { length: 118 }).notNull(),
    expiresAt: timestamp('expiresAt', { withTimezone: true }).notNull(),
});

export type PasswordResetToken = typeof passwordResetTokenSchema.$inferSelect;
