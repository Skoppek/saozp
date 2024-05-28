import { integer } from 'drizzle-orm/pg-core/columns';
import { pgTable } from 'drizzle-orm/pg-core/table';
import { userSchema } from '../userSchema';
import { userGroupSchema } from '../userGroupSchema';

export const usersToUserGroupSchema = pgTable('users_to_user_groups', {
    userId: integer('user_id')
        .notNull()
        .references(() => userSchema.id),
    groupId: integer('group_id')
        .notNull()
        .references(() => userGroupSchema.id),
});
