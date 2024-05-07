import { eq } from 'drizzle-orm/sql';
import { db } from '../model/db/db';
import { NewTest, testSchema } from '../model/schemas/testSchema';

const createTest = async (newTest: NewTest) => {
    await db.insert(testSchema).values(newTest).returning();
};

const getTestsOfSubmission = async (submissionId: number) => {
    return await db
        .select()
        .from(testSchema)
        .where(eq(testSchema.submissionId, submissionId));
};

export default {
    createTest,
    getTestsOfSubmission,
};
