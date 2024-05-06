import { eq } from 'drizzle-orm/sql';
import { db } from '../model/db/db';
import { results } from '../model/schemas/resultSchema';
import { NewTest, tests } from '../model/schemas/testSchema';

const createTest = async (newTest: NewTest) => {
    await db.insert(tests).values(newTest).returning();
};

const getTestsWithResultOfSubmission = async (submissionId: number) => {
    const sq = db
        .$with('sq')
        .as(
            db.select().from(tests).where(eq(tests.submissionId, submissionId)),
        );

    return await db
        .with(sq)
        .select({
            token: sq.token,
            input: sq.input,
            expected: sq.expected,
            received: results.stdout,
            memory: results.memory,
            time: results.time,
            statusId: results.statusId,
        })
        .from(sq)
        .leftJoin(results, eq(sq.token, results.token));
};

export default {
    createTest,
    getTestsWithResultOfSubmission,
};
