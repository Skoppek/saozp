import { and, eq, sql } from 'drizzle-orm';
import { db } from '../model/db/db';
import {
    NewSubmission,
    Submission,
    submissions,
} from '../model/schemas/submissionSchema';
import { profiles } from '../model/schemas/profileSchema';

interface SubmissionListEntry {
    id: number;
    creator: string;
    createdAt: Date | null;
}

const createSubmission = async (
    newSubmission: NewSubmission,
): Promise<Submission[]> => {
    return db.insert(submissions).values(newSubmission).returning();
};

const getSubmissionsList = async (
    userId?: number,
    problemId?: number,
): Promise<SubmissionListEntry[]> => {
    return db
        .select({
            id: submissions.id,
            creator: sql<string>`${profiles.firstName} ${profiles.lastName}`,
            createdAt: submissions.createdAt,
        })
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
