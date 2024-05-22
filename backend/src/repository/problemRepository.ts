import { eq, and } from 'drizzle-orm';
import { db } from '../model/db/db';
import {
    NewProblem,
    Problem,
    problemSchema,
} from '../model/schemas/problemSchema';
import _ from 'lodash';
import { profileSchema } from '../model/schemas/profileSchema';
import { userSchema } from '../model/schemas/userSchema';

const createProblem = async (
    newProblem: NewProblem,
): Promise<NewProblem | undefined> => {
    return (await db.insert(problemSchema).values(newProblem).returning()).at(
        0,
    );
};

const getProblems = async () => {
    return db
        .select()
        .from(problemSchema)
        .leftJoin(
            profileSchema,
            eq(problemSchema.creator, profileSchema.userId),
        )
        .leftJoin(userSchema, eq(problemSchema.creator, userSchema.id))
        .where(eq(problemSchema.isDeactivated, false));
};

const getProblemById = async (
    problemId: number,
): Promise<Problem | undefined> => {
    return (
        await db
            .select()
            .from(problemSchema)
            .where(
                and(
                    eq(problemSchema.id, problemId),
                    eq(problemSchema.isDeactivated, false),
                ),
            )
    ).at(0);
};

const updateProblemById = async (
    problemId: number,
    problem: Partial<NewProblem>,
): Promise<Problem | undefined> => {
    return (
        await db
            .update(problemSchema)
            .set({ ..._.omitBy(problem, (value) => _.isUndefined(value)) })
            .where(eq(problemSchema.id, problemId))
            .returning()
    ).at(0);
};

const deleteProblemById = async (problemId: number) => {
    await db
        .update(problemSchema)
        .set({
            isDeactivated: true,
        })
        .where(eq(problemSchema.id, problemId));
};

export default {
    createProblem,
    getProblems,
    getProblemById,
    updateProblemById,
    deleteProblemById,
};
