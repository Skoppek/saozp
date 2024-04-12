import { eq, inArray } from 'drizzle-orm/sql';
import { db } from '../model/db/db';
import { results } from '../model/schemas/resultSchema';
import { NewTest, tests } from '../model/schemas/testSchema';

const createTest = async (newTest: NewTest) => {
    await db.insert(tests).values(newTest).returning();
};

const getTestsWithResultOfSubmission = async (submissionId: number) => {
    const submissionTests = db
        .$with('submission_tests')
        .as(
            db.select().from(tests).where(eq(tests.submissionId, submissionId)),
        );

    return await db
        .with(submissionTests)
        .select({
            input: tests.input,
            expected: tests.expected,
            recieved: results.stdout,
            memory: results.memory,
            time: results.time,
            statusId: results.statusId,
        })
        .from(tests)
        .innerJoin(results, eq(tests.token, results.token));
};

export default {
    createTest,
    getTestsWithResultOfSubmission,
};
