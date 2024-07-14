import { eq } from 'drizzle-orm/sql';
import { db } from '../model/db/db';
import { NewTest, testSchema } from '../model/schemas/testSchema';

export default class TestRepository {
    async createTest(newTest: NewTest) {
        const result = await db.insert(testSchema).values(newTest).returning();
        return result.at(0);
    }

    async getTestsOfSubmission(submissionId: number) {
        return db
            .select()
            .from(testSchema)
            .where(eq(testSchema.submissionId, submissionId));
    }
}
