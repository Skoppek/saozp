import { eq } from 'drizzle-orm';
import { db } from '../model/db/db';
import {
    NewProblem,
    Problem,
    problemSchema,
} from '../model/schemas/problemSchema';
import _, { values } from 'lodash';
import { profileSchema } from '../model/schemas/profileSchema';

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
        );
};

const getProblemById = async (
    problemId: number,
): Promise<Problem | undefined> => {
    return (
        await db
            .select()
            .from(problemSchema)
            .where(eq(problemSchema.id, problemId))
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
