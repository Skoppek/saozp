import { integer } from 'drizzle-orm/pg-core/columns';
import { pgTable } from 'drizzle-orm/pg-core/table';
import { userSchema } from './userSchema';
import { contestSchema } from './contestSchema';

export const usersToContestSchema = pgTable(
    'users_to_contests',
    {
        userId: integer('user_id')
            .references(() => userSchema.id)
            .notNull(),
        contestId: integer('contest_id')
            .references(() => contestSchema.id, { onDelete: 'cascade' })
            .notNull(),
    }
);
