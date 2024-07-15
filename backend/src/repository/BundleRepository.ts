import { NewBundle, bundleSchema } from '../model/schemas/bundleSchema';
import { db } from '../model/db/db';
import { eq } from 'drizzle-orm/sql';
import { and } from 'drizzle-orm';
import { profileSchema } from '../model/schemas/profileSchema';
import { problemsToBundleSchema } from '../model/schemas/intermediates/problemsToBundleSchema';
import { problemSchema } from '../model/schemas/problemSchema';

export default class BundleRepository {
    async createBundle(newBundle: NewBundle) {
        const result = await db
            .insert(bundleSchema)
            .values(newBundle)
            .returning();
        return result.at(0);
    }

    async getBundleList() {
        const result = await db
            .select()
            .from(bundleSchema)
            .innerJoin(
                profileSchema,
                eq(profileSchema.userId, bundleSchema.owner),
            );

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
        const result = await db
            .insert(problemsToBundleSchema)
            .values({
                bundleId,
                problemId,
            })
            .returning();

        return result.at(0);
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
