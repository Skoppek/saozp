import {char, integer, pgTable, timestamp} from "drizzle-orm/pg-core";
import {userSchema} from "./userSchema";

export const passwordResetTokenSchema = pgTable('password_rest_token', {
    userId: integer('user_id').references(() => userSchema.id).primaryKey(),
    token: char('token', {length: 8}).notNull(),
    expiresAt: timestamp('expiresAt', { withTimezone: true }).notNull(),
});

export type PasswordResetToken = typeof passwordResetTokenSchema.$inferSelect;