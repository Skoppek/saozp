import {
    NewUserGroup,
    userGroupSchema,
} from '../model/schemas/userGroupSchema';
import { db } from '../model/db/db';
import { usersToUserGroupSchema } from '../model/schemas/intermediates/usersToUserGroupSchema';
import { and } from 'drizzle-orm';
import { eq } from 'drizzle-orm/sql';
import { profileSchema } from '../model/schemas/profileSchema';

const createUserGroup = async (newUserGroup: NewUserGroup) => {
    const result = await db
        .insert(userGroupSchema)
        .values(newUserGroup)
        .returning();
    return result.at(0);
};

const getUserGroup = async (groupId: number) => {
    const result = await db
        .select()
        .from(userGroupSchema)
        .innerJoin(
            profileSchema,
            eq(profileSchema.userId, userGroupSchema.owner),
        )
        .where(eq(userGroupSchema.id, groupId));

    return result
        .map((entry) => {
            return { ...entry.user_groups, owner: entry.profiles };
        })
        .at(0);
};

const updateUserGroup = async (
    data: Partial<NewUserGroup>,
    groupId: number,
) => {
    const result = await db
        .update(userGroupSchema)
        .set(data)
        .where(eq(userGroupSchema.id, groupId))
        .returning();

    return result.at(0);
};

const deleteUserGroup = async (groupId: number) =>
    await db.delete(userGroupSchema).where(eq(userGroupSchema.id, groupId));

const addUserToGroup = async (groupId: number, userId: number) => {
    const result = await db
        .insert(usersToUserGroupSchema)
        .values({
            userId,
            groupId,
        })
        .returning();

    return result.at(0);
};

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

const getProfilesOfGroup = async (groupId: number) => {
    const result = await db
        .select()
        .from(profileSchema)
        .innerJoin(
            usersToUserGroupSchema,
            eq(profileSchema.userId, usersToUserGroupSchema.groupId),
        )
        .where(eq(usersToUserGroupSchema.groupId, groupId));

    return result.map((entry) => entry.profiles).filter((user) => !!user);
};

const getUserGroupList = async () => {
    const result = await db
        .select()
        .from(userGroupSchema)
        .innerJoin(
            profileSchema,
            eq(profileSchema.userId, userGroupSchema.owner),
        );

    return result.map((entry) => {
        return { ...entry.user_groups, owner: entry.profiles };
    });
};

export default {
    createUserGroup,
    addUserToGroup,
    removeUserFromGroup,
    getProfilesOfGroup,
    getUserGroupList,
    getUserGroup,
    updateUserGroup,
    deleteUserGroup,
};
