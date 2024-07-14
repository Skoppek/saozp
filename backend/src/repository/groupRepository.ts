import { NewGroup, groupSchema } from '../model/schemas/groupSchema';
import { db } from '../model/db/db';
import { usersToGroupSchema } from '../model/schemas/intermediates/usersToGroupSchema';
import { and } from 'drizzle-orm';
import { eq } from 'drizzle-orm/sql';
import { profileSchema } from '../model/schemas/profileSchema';

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

    async getGroupList() {
        const result = await db
            .select()
            .from(groupSchema)
            .innerJoin(
                profileSchema,
                eq(profileSchema.userId, groupSchema.owner),
            );

        return result.map((entry) => {
            return { ...entry.groups, owner: entry.profiles };
        });
    }
}
