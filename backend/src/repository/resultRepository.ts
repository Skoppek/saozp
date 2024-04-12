import { db } from '../model/db/db';
import { NewResult, Result, results } from '../model/schemas/resultSchema';

const createResult = async (
    newResult: NewResult,
): Promise<Result | undefined> => {
    return (await db.insert(results).values(newResult).returning()).at(0);
};

export default {
    createResult,
};
