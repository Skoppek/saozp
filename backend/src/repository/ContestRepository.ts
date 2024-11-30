import { db } from '../db/db';
import { eq } from 'drizzle-orm/sql';
import { and } from 'drizzle-orm';
import { usersToContestSchema } from '../db/schema/usersToContestSchema';
import { mapIfPresent } from '../shared/mapper';
import _ from 'lodash';
import { Contest, NewContest } from '../db/schema/contestSchema';
import { contestSchema } from '../schema/contestSchema';
import { profileSchema } from '../db/schema/profileSchema';
import { stageSchema } from '../db/schema/stageSchema';

export default class ContestRepository {
    static async createContest(newContest: NewContest) {
        const result = await db
            .insert(contestSchema)
            .values(newContest)
            .returning();
        return result.at(0);
    }

    static async updateContest(id: number, data: Partial<Contest>) {
        const result = await db
            .update(contestSchema)
            .set(data)
            .where(eq(contestSchema.id, id))
            .returning();
        return result.at(0);
    }

    static async deleteContest(id: number) {
        const result = await db
            .delete(contestSchema)
            .where(eq(contestSchema.id, id))
            .returning();
        return result.at(0);
    }

    static async getContests(participantId?: number, ownerId?: number) {
        const result = await db
            .select()
            .from(contestSchema)
            .innerJoin(
                profileSchema,
                eq(profileSchema.userId, contestSchema.owner),
            )
            .leftJoin(
                usersToContestSchema,
                eq(usersToContestSchema.contestId, contestSchema.id),
            )
            .where(
                and(
                    mapIfPresent(participantId, (id) =>
                        eq(usersToContestSchema.userId, id),
                    ),
                    mapIfPresent(ownerId, (id) => eq(contestSchema.owner, id)),
                ),
            );

        return _.uniqBy(
            result.map((entry) => {
                return { ...entry.contests, owner: entry.profiles };
            }),
            'id',
        );
    }

    static async getContestById(contestId: number) {
        const result = await db
            .select()
            .from(contestSchema)
            .innerJoin(
                profileSchema,
                eq(profileSchema.userId, contestSchema.owner),
            )
            .leftJoin(stageSchema, eq(stageSchema.contestId, contestSchema.id))
            .where(eq(contestSchema.id, contestId));

        return result
            .map((entry) => {
                return {
                    ...entry.contests,
                    owner: entry.profiles,
                };
            })
            .at(0);
    }

    static async addUser(contestId: number, userId: number) {
        await db
            .insert(usersToContestSchema)
            .values({
                contestId,
                userId,
            })
            .onConflictDoNothing();
    }

    static async removeUser(contestId: number, userId: number) {
        await db
            .delete(usersToContestSchema)
            .where(
                and(
                    eq(usersToContestSchema.contestId, contestId),
                    eq(usersToContestSchema.userId, userId),
                ),
            );
    }
}
