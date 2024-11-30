import { integer } from 'drizzle-orm/pg-core/columns';
import { pgTable } from 'drizzle-orm/pg-core/table';
import { userSchema } from '../userSchema';
import { groupSchema } from '../groupSchema';
import { primaryKey } from 'drizzle-orm/pg-core';

export const usersToGroupSchema = pgTable(
    'users_to_groups',
    {
        userId: integer('user_id')
            .references(() => userSchema.id)
            .notNull(),
        groupId: integer('group_id')
            .references(() => groupSchema.id, { onDelete: 'cascade' })
            .notNull(),
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.userId, table.groupId] }),
        };
    },
);
