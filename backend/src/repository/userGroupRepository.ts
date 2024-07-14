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
            .innerJoin(
                usersToUserGroupSchema,
                eq(profileSchema.userId, usersToUserGroupSchema.groupId),
            )
            .where(eq(usersToUserGroupSchema.groupId, groupId))
    )
        .map((entry) => entry.profiles)
        .filter((user) => !!user);

const getUserGroupList = async () =>
    (
        await db
            .select()
            .from(userGroupSchema)
            .innerJoin(
                profileSchema,
                eq(profileSchema.userId, userGroupSchema.owner),
            )
    ).map((entry) => {
        return { ...entry.user_groups, owner: entry.profiles };
    });

const getUserGroup = async (groupId: number) =>
    (
        await db
            .select()
            .from(userGroupSchema)
            .innerJoin(
                profileSchema,
                eq(profileSchema.userId, userGroupSchema.owner),
            )
            .where(eq(userGroupSchema.id, groupId))
    )
        .map((entry) => {
            return { ...entry.user_groups, owner: entry.profiles };
        })
        .at(0);

export default {
    createUserGroup,
    addUserToGroup,
    removeUserFromGroup,
    getProfilesOfGroup,
    getUserGroupList,
    getUserGroup,
};
