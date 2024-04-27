import { index, integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { users } from './userSchema';

export const profiles = pgTable(
    'profiles',
    {
        userId: integer('user_id')
            .references(() => users.id)
            .primaryKey(),
        firstName: varchar('first_name', { length: 32 }).notNull(),
        lastName: varchar('last_name', { length: 32 }).notNull(),
    },
    (profiles) => ({
        userIdIdx: index('user_id_idx').on(profiles.userId),
    }),
);

export type NewProfile = typeof profiles.$inferInsert;
export type Profile = typeof profiles.$inferSelect;
