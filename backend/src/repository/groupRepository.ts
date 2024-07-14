import { NewGroup, groupSchema } from '../model/schemas/groupSchema';
import { db } from '../model/db/db';
import { usersToGroupSchema } from '../model/schemas/intermediates/usersToGroupSchema';
import { and } from 'drizzle-orm';
import { eq } from 'drizzle-orm/sql';
import { profileSchema } from '../model/schemas/profileSchema';

const createGroup = async (newUserGroup: NewGroup) => {
    const result = await db
        .insert(groupSchema)
        .values(newUserGroup)
        .returning();
    return result.at(0);
};

const getGroup = async (groupId: number) => {
    const result = await db
        .select()
        .from(groupSchema)
        .innerJoin(profileSchema, eq(profileSchema.userId, groupSchema.owner))
        .where(eq(groupSchema.id, groupId));

    return result
        .map((entry) => {
            return { ...entry.groups, owner: entry.profiles };
        })
        .at(0);
};

const updateGroup = async (data: Partial<NewGroup>, groupId: number) => {
    const result = await db
        .update(groupSchema)
        .set(data)
        .where(eq(groupSchema.id, groupId))
        .returning();

    return result.at(0);
};

const deleteGroup = async (groupId: number) =>
    await db.delete(groupSchema).where(eq(groupSchema.id, groupId));

const addUserToGroup = async (groupId: number, userId: number) => {
    const result = await db
        .insert(usersToGroupSchema)
        .values({
            userId,
            groupId,
        })
        .returning();

    return result.at(0);
};

const removeUserFromGroup = async (groupId: number, userId: number) => {
    await db
        .delete(usersToGroupSchema)
        .where(
            and(
                eq(usersToGroupSchema.groupId, groupId),
                eq(usersToGroupSchema.userId, userId),
            ),
        );
};

const getProfilesOfGroup = async (groupId: number) => {
    const result = await db
        .select()
        .from(profileSchema)
        .innerJoin(
            usersToGroupSchema,
            eq(profileSchema.userId, usersToGroupSchema.groupId),
        )
        .where(eq(usersToGroupSchema.groupId, groupId));

    return result.map((entry) => entry.profiles).filter((user) => !!user);
};

const getGroupList = async () => {
    const result = await db
        .select()
        .from(groupSchema)
        .innerJoin(profileSchema, eq(profileSchema.userId, groupSchema.owner));

    return result.map((entry) => {
        return { ...entry.groups, owner: entry.profiles };
    });
};

export default {
    createGroup,
    addUserToGroup,
    removeUserFromGroup,
    getProfilesOfGroup,
    getGroupList,
    getGroup,
    updateGroup,
    deleteGroup,
};
