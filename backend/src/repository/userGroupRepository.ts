import {
    NewUserGroup,
    userGroupSchema,
} from '../model/schemas/userGroupSchema';
import { db } from '../model/db/db';
import { usersToUserGroupSchema } from '../model/schemas/intermediates/usersToUserGroupSchema';
import { and } from 'drizzle-orm';
import { eq } from 'drizzle-orm/sql';
import { profileSchema } from '../model/schemas/profileSchema';

const createUserGroup = async (newUserGroup: NewUserGroup) =>
    (await db.insert(userGroupSchema).values(newUserGroup).returning()).at(0);

const addUserToGroup = async (groupId: number, userId: number) =>
    (
        await db
            .insert(usersToUserGroupSchema)
            .values({
                userId,
                groupId,
            })
            .returning()
    ).at(0);

const removeUserFromGroup = async (groupId: number, userId: number) => {
    await db
        .delete(usersToUserGroupSchema)
        .where(
            and(
                eq(usersToUserGroupSchema.groupId, groupId),
                eq(usersToUserGroupSchema.userId, userId),
            ),
        );
};

const getProfilesOfGroup = async (groupId: number) =>
    (
        await db
            .select()
            .from(profileSchema)
            .rightJoin(
                usersToUserGroupSchema,
                eq(profileSchema.userId, usersToUserGroupSchema.groupId),
            )
            .where(eq(usersToUserGroupSchema.groupId, groupId))
    )
        .map((entry) => entry.profiles)
        .filter((user) => !!user);

export default {
    createUserGroup,
    addUserToGroup,
    removeUserFromGroup,
    getProfilesOfGroup,
};
