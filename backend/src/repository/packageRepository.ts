import { NewPackage, packageSchema } from '../model/schemas/packageSchema';
import { db } from '../model/db/db';
import { eq } from 'drizzle-orm/sql';
import { and } from 'drizzle-orm';
import { profileSchema } from '../model/schemas/profileSchema';
import { problemsToPackageSchema } from '../model/schemas/intermediates/problemsToPackageSchema';
import { problemSchema } from '../model/schemas/problemSchema';

const createPackage = async (newPackage: NewPackage) => {
    const result = await db
        .insert(packageSchema)
        .values(newPackage)
        .returning();
    return result.at(0);
};

const getPackageList = async () => {
    const result = await db
        .select()
        .from(packageSchema)
        .innerJoin(
            profileSchema,
            eq(profileSchema.userId, packageSchema.owner),
        );

    return result.map((entry) => {
        return { ...entry.package, owner: entry.profiles };
    });
};

const updateProblemPackage = async (
    packageId: number,
    data: Partial<NewPackage>,
) => {
    const result = await db
        .update(packageSchema)
        .set(data)
        .where(eq(packageSchema.id, packageId))
        .returning();
    return result.at(0);
};

const deleteProblemPackage = async (packageId: number) =>
    await db.delete(packageSchema).where(eq(packageSchema.id, packageId));

const addProblemToPackage = async (packageId: number, problemId: number) => {
    const result = await db
        .insert(problemsToPackageSchema)
        .values({
            packageId,
            problemId,
        })
        .returning();

    return result.at(0);
};

const removeProblemFromPackage = async (
    packageId: number,
    problemId: number,
) => {
    await db
        .delete(problemsToPackageSchema)
        .where(
            and(
                eq(problemsToPackageSchema.packageId, packageId),
                eq(problemsToPackageSchema.problemId, problemId),
            ),
        );
};

const getProblemsOfPackage = async (packageId: number) => {
    const result = await db
        .select({
            id: problemSchema.id,
            name: problemSchema.name,
            languageId: problemSchema.languageId,
        })
        .from(problemsToPackageSchema)
        .innerJoin(
            problemSchema,
            eq(problemsToPackageSchema.problemId, problemSchema.id),
        )
        .where(eq(problemsToPackageSchema.packageId, packageId));

    return result.map((entry) => entry);
};

export default {
    createPackage,
    getPackageList,
    updateProblemPackage,
    deleteProblemPackage,
    addProblemToPackage,
    removeProblemFromPackage,
    getProblemsOfPackage,
};
