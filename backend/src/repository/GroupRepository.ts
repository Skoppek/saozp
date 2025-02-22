import { db } from '../db/db';
import { usersToGroupSchema } from '../db/schema/usersToGroupSchema';
import { and } from 'drizzle-orm';
import { eq } from 'drizzle-orm/sql';
import { profileSchema } from '../db/schema/profileSchema';
import { groupSchema, NewGroup } from '../db/schema/groupSchema';

export default class GroupRepository {
    async createGroup(newUserGroup: NewGroup) {
        const result = await db
            .insert(groupSchema)
            .values(newUserGroup)
            .returning();
        return result.at(0);
    }

    async getGroup(groupId: number) {
        const result = await db
            .select()
            .from(groupSchema)
            .innerJoin(
                profileSchema,
                eq(profileSchema.userId, groupSchema.owner),
            )
            .where(eq(groupSchema.id, groupId));

        return result
            .map((entry) => {
                return { ...entry.groups, owner: entry.profiles };
            })
            .at(0);
    }

    async updateGroup(data: Partial<NewGroup>, groupId: number) {
        const result = await db
            .update(groupSchema)
            .set(data)
            .where(eq(groupSchema.id, groupId))
            .returning();

        return result.at(0);
    }

    async deleteGroup(groupId: number) {
        await db.delete(groupSchema).where(eq(groupSchema.id, groupId));
    }

    async addUserToGroup(groupId: number, userId: number) {
        const result = await db
            .insert(usersToGroupSchema)
            .values({
                userId,
                groupId,
            })
            .onConflictDoNothing()
            .returning();

        return result.at(0);
    }

    async removeUserFromGroup(groupId: number, userId: number) {
        await db
            .delete(usersToGroupSchema)
            .where(
                and(
                    eq(usersToGroupSchema.groupId, groupId),
                    eq(usersToGroupSchema.userId, userId),
                ),
            );
    }

    async getProfilesOfGroup(groupId: number) {
        const result = await db
            .select()
            .from(profileSchema)
            .innerJoin(
                usersToGroupSchema,
                eq(profileSchema.userId, usersToGroupSchema.groupId),
            )
            .where(eq(usersToGroupSchema.groupId, groupId));

        return result.map((entry) => entry.profiles).filter((user) => !!user);
    }

    async getGroupsOfOwner(ownerId: number) {
        const result = await db
            .select()
            .from(groupSchema)
            .innerJoin(
                profileSchema,
                eq(profileSchema.userId, groupSchema.owner),
            )
            .where(eq(groupSchema.owner, ownerId));

        return result.map((entry) => {
            return { ...entry.groups, owner: entry.profiles };
        });
    }
}
