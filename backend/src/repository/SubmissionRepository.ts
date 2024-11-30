import { and, eq } from 'drizzle-orm';
import { db } from '../db/db';
import { mapIfPresent } from '../shared/mapper';
import { NewSubmission, submissionSchema } from '../db/schema/submissionSchema';
import { profileSchema } from '../db/schema/profileSchema';

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
        stageId?: number,
    ) {
        return db
            .select({
                id: submissionSchema.id,
                creator: profileSchema,
                createdAt: submissionSchema.createdAt,
                problemId: submissionSchema.problemId,
                rerun: submissionSchema.rerun,
                stageId: submissionSchema.stageId,
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
                ),
            );
    }
}
