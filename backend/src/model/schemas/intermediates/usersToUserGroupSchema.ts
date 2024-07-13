import { integer } from 'drizzle-orm/pg-core/columns';
import { pgTable } from 'drizzle-orm/pg-core/table';
import { userSchema } from '../userSchema';
import { userGroupSchema } from '../userGroupSchema';

export const usersToUserGroupSchema = pgTable('users_to_user_groups', {
    userId: integer('user_id')
        .references(() => userSchema.id)
        .notNull(),
    groupId: integer('group_id')
        .references(() => userGroupSchema.id)
        .notNull(),
});
