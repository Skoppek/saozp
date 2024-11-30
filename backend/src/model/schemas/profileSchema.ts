import { index, integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { userSchema } from './userSchema';

export const profileSchema = pgTable(
    'profiles',
    {
        userId: integer('user_id')
            .references(() => userSchema.id)
            .primaryKey(),
        firstName: varchar('first_name', { length: 32 }).notNull(),
        lastName: varchar('last_name', { length: 32 }).notNull(),
    },
    (profiles) => ({
        userIdIdx: index('user_id_idx').on(profiles.userId),
    }),
);

export type NewProfile = typeof profileSchema.$inferInsert;
export type Profile = typeof profileSchema.$inferSelect;
