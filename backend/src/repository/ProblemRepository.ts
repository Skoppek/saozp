import { eq, and } from 'drizzle-orm';
import { db } from '../model/db/db';
import { NewProblem, problemSchema } from '../model/schemas/problemSchema';
import _ from 'lodash';
import { profileSchema } from '../model/schemas/profileSchema';
import { userSchema } from '../model/schemas/userSchema';

export default class ProblemRepository {
    async createProblem(newProblem: NewProblem) {
        const result = await db
            .insert(problemSchema)
            .values(newProblem)
            .returning();

        return result.at(0);
    }

    async getProblems() {
        return db
            .select()
            .from(problemSchema)
            .leftJoin(
                profileSchema,
                eq(problemSchema.creatorId, profileSchema.userId),
            )
            .leftJoin(userSchema, eq(problemSchema.creatorId, userSchema.id))
            .where(eq(problemSchema.isDeactivated, false));
    }

    async getProblemById(problemId: number) {
        const result = await db
            .select()
            .from(problemSchema)
            .where(
                and(
                    eq(problemSchema.id, problemId),
                    eq(problemSchema.isDeactivated, false),
                ),
            );

        return result.at(0);
    }

    async updateProblemById(problemId: number, problem: Partial<NewProblem>) {
        const result = await db
            .update(problemSchema)
            .set({ ..._.omitBy(problem, (value) => _.isUndefined(value)) })
            .where(eq(problemSchema.id, problemId))
            .returning();

        return result.at(0);
    }

    async deleteProblemById(problemId: number) {
        await db
            .update(problemSchema)
            .set({
                isDeactivated: true,
            })
            .where(eq(problemSchema.id, problemId));
    }
}
