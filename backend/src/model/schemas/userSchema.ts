import { relations } from 'drizzle-orm';
import { serial, pgTable, varchar, index } from 'drizzle-orm/pg-core';
import { profiles } from './profileSchema';

export const users = pgTable(
    'users',
    {
        id: serial('id').primaryKey(),
        email: varchar('email', { length: 256 }).unique().notNull(),
        password: varchar('password', { length: 128 }).notNull(),
    },
    (users) => ({
        emailIdx: index('email_idx').on(users.email),
    }),
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const userRelations = relations(users, ({ one }) => ({
    profile: one(profiles, {
        fields: [users.id],
        references: [profiles.userId],
    }),
}));
