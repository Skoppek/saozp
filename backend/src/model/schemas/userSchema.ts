import { relations } from 'drizzle-orm';
import { serial, pgTable, varchar, index } from 'drizzle-orm/pg-core';
import { profileSchema } from './profileSchema';

export const userSchema = pgTable(
    'users',
    {
        id: serial('id').primaryKey(),
        login: varchar('login', { length: 256 }).unique().notNull(),
        password: varchar('password', { length: 128 }).notNull(),
    },
    (users) => ({
        emailIdx: index('login_idx').on(users.login),
    }),
);

export type User = typeof userSchema.$inferSelect;
export type NewUser = typeof userSchema.$inferInsert;

export const userRelations = relations(userSchema, ({ one }) => ({
    profile: one(profileSchema, {
        fields: [userSchema.id],
        references: [profileSchema.userId],
    }),
}));
