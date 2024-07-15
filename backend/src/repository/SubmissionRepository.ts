import { and, eq } from 'drizzle-orm';
import { db } from '../model/db/db';
import {
    NewSubmission,
    submissionSchema,
} from '../model/schemas/submissionSchema';
import { profileSchema } from '../model/schemas/profileSchema';

export class SubmissionRepository {
    async createSubmission(newSubmission: NewSubmission) {
        const result = await db
            .insert(submissionSchema)
            .values(newSubmission)
            .returning();
        return result.at(0);
    }

    async getSubmissionsList(
        userId?: number,
        problemId?: number,
        commitsOnly?: boolean,
    ) {
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
    }

    async getSubmissionById(id: number) {
        const result = await db
            .select()
            .from(submissionSchema)
            .where(eq(submissionSchema.id, id));

        return result.at(0);
    }

    async deleteSubmissionById(id: number) {
        db.delete(submissionSchema).where(eq(submissionSchema.id, id));
    }

    async deleteNonCommitSubmissions(userId: number, problemId: number) {
        await db
            .delete(submissionSchema)
            .where(
                and(
                    eq(submissionSchema.userId, userId),
                    eq(submissionSchema.problemId, problemId),
                    eq(submissionSchema.isCommit, false),
                ),
            );
    }
}