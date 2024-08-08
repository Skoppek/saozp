import {
    Contest,
    contestSchema,
    NewContest,
} from '../model/schemas/contestSchema';
import { db } from '../model/db/db';
import { eq } from 'drizzle-orm/sql';
import { problemsToContestSchema } from '../model/schemas/intermediates/problemsToContestSchema';
import { and } from 'drizzle-orm';
import { usersToContestSchema } from '../model/schemas/intermediates/usersToContestSchema';
import { profileSchema } from '../model/schemas/profileSchema';
import { mapIfPresent } from '../shared/mapper';

export default class ContestRepository {
    async createContest(newContest: NewContest) {
        const result = await db
            .insert(contestSchema)
            .values(newContest)
            .returning();
        return result.at(0);
    }

    async updateContest(id: number, data: Partial<Contest>) {
        const result = await db
            .update(contestSchema)
            .set(data)
            .where(eq(contestSchema.id, id))
            .returning();
        return result.at(0);
    }

    async deleteContest(id: number) {
        const result = await db
            .delete(contestSchema)
            .where(eq(contestSchema.id, id))
            .returning();
        return result.at(0);
    }

    async getContests(participantId?: number, ownerId?: number) {
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

        return result.map((entry) => {
            return { ...entry.contests, owner: entry.profiles };
        });
    }

    async getContestById(contestId: number) {
        const result = await db
            .select()
            .from(contestSchema)
            .innerJoin(
                profileSchema,
                eq(profileSchema.userId, contestSchema.owner),
            )
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

    async addProblem(contestId: number, problemId: number) {
        await db
            .insert(problemsToContestSchema)
            .values({
                contestId,
                problemId,
            })
            .onConflictDoNothing()
            .returning();
    }

    async removeProblem(contestId: number, problemId: number) {
        await db
            .delete(problemsToContestSchema)
            .where(
                and(
                    eq(problemsToContestSchema.contestId, contestId),
                    eq(problemsToContestSchema.problemId, problemId),
                ),
            );
    }

    async addUser(contestId: number, userId: number) {
        await db
            .insert(usersToContestSchema)
            .values({
                contestId,
                userId,
            })
            .onConflictDoNothing();
    }

    async removeUser(contestId: number, userId: number) {
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
