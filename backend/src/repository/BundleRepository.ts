import { db } from '../db/db';
import { eq } from 'drizzle-orm/sql';
import { and } from 'drizzle-orm';
import { bundleSchema, NewBundle } from '../db/schema/bundleSchema';
import { profileSchema } from '../db/schema/profileSchema';
import { problemsToBundleSchema } from '../db/schema/problemsToBundleSchema';
import { problemSchema } from '../db/schema/problemSchema';

export default class BundleRepository {
    async createBundle(newBundle: NewBundle) {
        const result = await db
            .insert(bundleSchema)
            .values(newBundle)
            .returning();
        return result.at(0);
    }

    async getBundleList(userId: number) {
        const result = await db
            .select()
            .from(bundleSchema)
            .innerJoin(
                profileSchema,
                eq(profileSchema.userId, bundleSchema.owner),
            )
            .where(eq(bundleSchema.owner, userId));

        return result.map((entry) => {
            return { ...entry.bundle, owner: entry.profiles };
        });
    }

    async getBundle(bundleId: number) {
        const result = await db
            .select()
            .from(bundleSchema)
            .innerJoin(
                profileSchema,
                eq(profileSchema.userId, bundleSchema.owner),
            )
            .where(eq(bundleSchema.id, bundleId));

        return result
            .map((entry) => {
                return { ...entry.bundle, owner: entry.profiles };
            })
            .at(0);
    }

    async updateBundle(bundleId: number, data: Partial<NewBundle>) {
        const result = await db
            .update(bundleSchema)
            .set(data)
            .where(eq(bundleSchema.id, bundleId))
            .returning();
        return result.at(0);
    }

    async deleteBundle(bundleId: number) {
        await db.delete(bundleSchema).where(eq(bundleSchema.id, bundleId));
    }

    async addProblemToBundle(bundleId: number, problemId: number) {
        await db
            .insert(problemsToBundleSchema)
            .values({
                bundleId,
                problemId,
            })
            .onConflictDoNothing();
    }

    async removeProblemFromBundle(bundleId: number, problemId: number) {
        await db
            .delete(problemsToBundleSchema)
            .where(
                and(
                    eq(problemsToBundleSchema.bundleId, bundleId),
                    eq(problemsToBundleSchema.problemId, problemId),
                ),
            );
    }

    async getProblemsOfBundle(bundleId: number) {
        const result = await db
            .select({
                id: problemSchema.id,
                name: problemSchema.name,
                languageId: problemSchema.languageId,
            })
            .from(problemsToBundleSchema)
            .innerJoin(
                problemSchema,
                eq(problemsToBundleSchema.problemId, problemSchema.id),
            )
            .where(eq(problemsToBundleSchema.bundleId, bundleId));

        return result.map((entry) => entry);
    }
}
