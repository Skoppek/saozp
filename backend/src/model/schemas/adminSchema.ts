import { integer, pgTable } from 'drizzle-orm/pg-core';
import { users } from './userSchema';

export const admins = pgTable('admins', {
    id: integer('id')
        .references(() => users.id)
        .primaryKey(),
});

export type NewAdmin = typeof admins.$inferInsert;
export type Admin = typeof admins.$inferSelect;
