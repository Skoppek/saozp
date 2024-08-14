import { eq, and } from 'drizzle-orm';
import { db } from '../model/db/db';
import { NewProblem, problemSchema } from '../model/schemas/problemSchema';
import _ from 'lodash';
import { profileSchema } from '../model/schemas/profileSchema';
import { userSchema } from '../model/schemas/userSchema';
import { problemsToBundleSchema } from '../model/schemas/intermediates/problemsToBundleSchema';
import { problemsToContestSchema } from '../model/schemas/intermediates/problemsToContestSchema';

export default class ProblemRepository {
    async createProblem(newProblem: NewProblem) {
        const result = await db
            .insert(problemSchema)
            .values(newProblem)
            .returning();

        return result.at(0);
    }

    async getProblems() {
        const result = await db
            .select()
            .from(problemSchema)
            .innerJoin(
                profileSchema,
                eq(problemSchema.creatorId, profileSchema.userId),
            )
            .innerJoin(userSchema, eq(problemSchema.creatorId, userSchema.id))
            .where(eq(problemSchema.isDeactivated, false));

        return result.map((entry) => {
            return {
                ...entry.problems,
                creator: entry.profiles,
            };
        });
    }

    async getProblemsOfBundle(bundleId: number) {
        const result = await db
            .select({
                problem: problemSchema,
            })
            .from(problemSchema)
            .innerJoin(
                problemsToBundleSchema,
                eq(problemsToBundleSchema.problemId, problemSchema.id),
            )
            .where(eq(problemsToBundleSchema.bundleId, bundleId));

        return result.map((entry) => entry.problem);
    }

    async getProblemsOfContest(contestId: number) {
        return db
            .select({
                problemId: problemSchema.id,
                name: problemSchema.name,
                languageId: problemSchema.languageId,
            })
            .from(problemSchema)
            .innerJoin(
                problemsToContestSchema,
                eq(problemsToContestSchema.problemId, problemSchema.id),
            )
            .where(eq(problemsToContestSchema.contestId, contestId));
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
            .set(_.omitBy(problem, (value) => _.isUndefined(value)))
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
