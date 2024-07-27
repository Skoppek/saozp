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

    async getContests() {
        return db.select().from(contestSchema);
    }

    async getContestById(contestId: number) {
        return db
            .select()
            .from(contestSchema)
            .innerJoin(
                profileSchema,
                eq(profileSchema.userId, contestSchema.owner),
            )
            .where(eq(contestSchema.id, contestId));
    }

    async addProblem(contestId: number, problemId: number) {
        const result = await db
            .insert(problemsToContestSchema)
            .values({
                contestId,
                problemId,
            })
            .returning();
        return result.at(0);
    }

    async removeProblem(contestId: number, problemId: number) {
        const result = await db
            .delete(problemsToContestSchema)
            .where(
                and(
                    eq(problemsToContestSchema.contestId, contestId),
                    eq(problemsToContestSchema.problemId, problemId),
                ),
            )
            .returning();
        return result.at(0);
    }

    async addUser(contestId: number, userId: number) {
        const result = await db
            .insert(usersToContestSchema)
            .values({
                contestId,
                userId,
            })
            .returning();
        return result.at(0);
    }

    async removeUser(contestId: number, userId: number) {
        const result = await db
            .delete(usersToContestSchema)
            .where(
                and(
                    eq(usersToContestSchema.contestId, contestId),
                    eq(usersToContestSchema.userId, userId),
                ),
            )
            .returning();
        return result.at(0);
    }
}
