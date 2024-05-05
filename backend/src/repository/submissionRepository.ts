import { and, eq } from 'drizzle-orm';
import { db } from '../model/db/db';
import {
    NewSubmission,
    Submission,
    submissions,
} from '../model/schemas/submissionSchema';
import { profiles } from '../model/schemas/profileSchema';

const createSubmission = async (
    newSubmission: NewSubmission,
): Promise<Submission[]> => {
    return db.insert(submissions).values(newSubmission).returning();
};

const getSubmissionsList = async (userId?: number, problemId?: number) => {
    return db
        .select()
        .from(submissions)
        .leftJoin(profiles, eq(submissions.userId, profiles.userId))
        .where(
            and(
                userId ? eq(submissions.userId, userId) : undefined,
                problemId ? eq(submissions.problemId, problemId) : undefined,
            ),
        );
};

const getSubmissionById = async (
    id: number,
): Promise<Submission | undefined> => {
    return (
        await db.select().from(submissions).where(eq(submissions.id, id))
    ).at(0);
};

export default {
    createSubmission,
    getSubmissionsList,
    getSubmissionById,
};
