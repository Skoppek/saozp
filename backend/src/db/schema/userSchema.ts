import { relations } from 'drizzle-orm';
import { serial, pgTable, varchar, char } from 'drizzle-orm/pg-core';
import { profileSchema } from './profileSchema';

export const userSchema = pgTable(
    'users',
    {
        id: serial('id').primaryKey(),
        login: varchar('login', { length: 64 }).unique().notNull(),
        password: char('password', { length: 118 }).notNull(),
    }
);

export type User = typeof userSchema.$inferSelect;
export type NewUser = typeof userSchema.$inferInsert;

export const userRelations = relations(userSchema, ({ one }) => ({
    profile: one(profileSchema, {
        fields: [userSchema.id],
        references: [profileSchema.userId],
    }),
}));
