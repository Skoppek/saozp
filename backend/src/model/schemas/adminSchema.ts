import { integer, pgTable } from 'drizzle-orm/pg-core';
import { userSchema } from './userSchema';

export const adminSchema = pgTable('admins', {
    id: integer('user_id')
        .references(() => userSchema.id)
        .primaryKey(),
});

export type NewAdmin = typeof adminSchema.$inferInsert;
export type Admin = typeof adminSchema.$inferSelect;
