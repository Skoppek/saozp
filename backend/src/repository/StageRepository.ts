import { and, eq } from 'drizzle-orm';
import { db } from '../model/db/db';
import { NewStage, Stage, stageSchema } from '../model/schemas/stageSchema';
import _ from 'lodash';
import { problemsToStageSchema } from '../model/schemas/intermediates/problemsToContestSchema';
import { mapIfPresent } from '../shared/mapper';

export default class StageRepository {
    static async createStage(newStage: NewStage) {
        const result = await db
            .insert(stageSchema)
            .values(newStage)
            .returning();
        return result.at(0);
    }

    static async getStageById(id: number) {
        const result = await db
            .select()
            .from(stageSchema)
            .where(eq(stageSchema.id, id));
        return result.at(0);
    }

    static async updateStage(id: number, data: Partial<Stage>) {
        const result = await db
            .update(stageSchema)
            .set(data)
            .where(eq(stageSchema.id, id))
            .returning();
        return result.at(0);
    }

    static async deleteContest(id: number) {
        const result = await db
            .delete(stageSchema)
            .where(eq(stageSchema.id, id))
            .returning();
        return result.at(0);
    }

    static async getStagesOfContest(contestId: number) {
        return db
            .select()
            .from(stageSchema)
            .where(eq(stageSchema.contestId, contestId));
    }

    static async addProblem(stageId: number, problemId: number) {
        db.insert(problemsToStageSchema)
            .values({ problemId, stageId })
            .returning();
    }

    static async removeProblem(stageId: number, problemId: number) {
        db.delete(problemsToStageSchema).where(
            and(
                eq(problemsToStageSchema.stageId, stageId),
                eq(problemsToStageSchema.problemId, problemId),
            ),
        );
    }
}
