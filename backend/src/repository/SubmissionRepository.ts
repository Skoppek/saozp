import { and, eq } from 'drizzle-orm';
import { db } from '../model/db/db';
import {
    NewSubmission,
    submissionSchema,
} from '../model/schemas/submissionSchema';
import { profileSchema } from '../model/schemas/profileSchema';
import { mapIfPresent } from '../shared/mapper';

export class SubmissionRepository {
    static async createSubmission(newSubmission: NewSubmission) {
        const result = await db
            .insert(submissionSchema)
            .values(newSubmission)
            .returning();
        return result.at(0);
    }

    static async getSubmissionsList(
        userId?: number,
        problemId?: number,
        commitsOnly?: boolean,
        stageId?: number,
    ) {
        return db
            .select({
                id: submissionSchema.id,
                creator: profileSchema,
                createdAt: submissionSchema.createdAt,
                isCommit: submissionSchema.isCommit,
                problemId: submissionSchema.problemId,
                rerun: submissionSchema.rerun,
            })
            .from(submissionSchema)
            .leftJoin(
                profileSchema,
                eq(submissionSchema.userId, profileSchema.userId),
            )
            .where(
                and(
                    mapIfPresent(userId, (id) =>
                        eq(submissionSchema.userId, id),
                    ),
                    mapIfPresent(problemId, (id) =>
                        eq(submissionSchema.problemId, id),
                    ),
                    mapIfPresent(commitsOnly, (isCommit) =>
                        eq(submissionSchema.isCommit, isCommit),
                    ),
                    mapIfPresent(stageId, (id) =>
                        eq(submissionSchema.stageId, id),
                    ),
                ),
            );
    }

    static async getSubmissionById(id: number) {
        const result = await db
            .select()
            .from(submissionSchema)
            .leftJoin(
                profileSchema,
                eq(submissionSchema.userId, profileSchema.userId),
            )
            .where(eq(submissionSchema.id, id));

        return result
            .map((submission) => {
                return {
                    ...submission.submissions,
                    creator: submission.profiles,
                };
            })
            .at(0);
    }

    static async deleteSubmissionById(id: number) {
        return db.delete(submissionSchema).where(eq(submissionSchema.id, id));
    }

    static async deleteNonCommitSubmissions(userId: number, problemId: number) {
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
