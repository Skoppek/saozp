import { and, eq } from 'drizzle-orm';
import { db } from '../model/db/db';
import {
    NewSubmission,
    Submission,
    submissionSchema,
} from '../model/schemas/submissionSchema';
import { profileSchema } from '../model/schemas/profileSchema';

const createSubmission = async (
    newSubmission: NewSubmission,
): Promise<Submission[]> => {
    return db.insert(submissionSchema).values(newSubmission).returning();
};

const getSubmissionsList = async (
    userId?: number,
    problemId?: number,
    commitsOnly?: boolean,
) => {
    return db
        .select({
            id: submissionSchema.id,
            creator: profileSchema,
            createdAt: submissionSchema.createdAt,
            isCommit: submissionSchema.isCommit,
        })
        .from(submissionSchema)
        .leftJoin(
            profileSchema,
            eq(submissionSchema.userId, profileSchema.userId),
        )
        .where(
            and(
                userId ? eq(submissionSchema.userId, userId) : undefined,
                problemId
                    ? eq(submissionSchema.problemId, problemId)
                    : undefined,
                commitsOnly
                    ? eq(submissionSchema.isCommit, commitsOnly)
                    : undefined,
            ),
        );
};

const getSubmissionById = async (
    id: number,
): Promise<Submission | undefined> => {
    return (
        await db
            .select()
            .from(submissionSchema)
            .where(eq(submissionSchema.id, id))
    ).at(0);
};

const deleteSubmissionById = async (id: number) => {
    db.delete(submissionSchema).where(eq(submissionSchema.id, id));
};

const deleteNonCommitSubmissoins = async (
    userId: number,
    problemId: number,
) => {
    await db
        .delete(submissionSchema)
        .where(
            and(
                eq(submissionSchema.userId, userId),
                eq(submissionSchema.problemId, problemId),
                eq(submissionSchema.isCommit, false),
            ),
        )
        .returning();
};

export default {
    createSubmission,
    getSubmissionsList,
    getSubmissionById,
    deleteSubmissionById,
    deleteNonCommitSubmissoins,
};
