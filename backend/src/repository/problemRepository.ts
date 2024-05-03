import { eq, sql } from 'drizzle-orm';
import { db } from '../model/db/db';
import { NewProblem, Problem, problems } from '../model/schemas/problemSchema';
import _ from 'lodash';
import { profiles } from '../model/schemas/profileSchema';

const createProblem = async (
    newProblem: NewProblem,
): Promise<NewProblem | undefined> => {
    return (await db.insert(problems).values(newProblem).returning()).at(0);
};

const getProblems = async () => {
    return db
        .select()
        .from(problems)
        .leftJoin(profiles, eq(problems.creator, profiles.userId));
};

const getProblemById = async (
    problemId: number,
): Promise<Problem | undefined> => {
    return (
        await db.select().from(problems).where(eq(problems.id, problemId))
    ).at(0);
};

const updateProblemById = async (
    problemId: number,
    problem: Partial<NewProblem>,
): Promise<Problem | undefined> => {
    return (
        await db
            .update(problems)
            .set({ ..._.omitBy(problem, (value) => _.isUndefined(value)) })
            .where(eq(problems.id, problemId))
            .returning()
    ).at(0);
};

const deleteProblemById = async (problemId: number) => {
    await db.delete(problems).where(eq(problems.id, problemId));
};

export default {
    createProblem,
    getProblems,
    getProblemById,
    updateProblemById,
    deleteProblemById,
};
