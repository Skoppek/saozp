import { eq } from 'drizzle-orm/sql';
import { db } from '../db/db';
import { NewTest, testSchema } from '../db/schema/testSchema';

export default class TestRepository {
    static async createTest(newTest: NewTest) {
        const result = await db.insert(testSchema).values(newTest).returning();
        return result.at(0);
    }

    static async getTestsOfSubmission(submissionId: number) {
        return db
            .select()
            .from(testSchema)
            .where(eq(testSchema.submissionId, submissionId));
    }
}
