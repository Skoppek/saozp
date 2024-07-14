import {
    NewProblemPackage,
    problemPackageSchema,
} from '../model/schemas/problemPackageSchema';
import { db } from '../model/db/db';
import { eq } from 'drizzle-orm/sql';
import { and } from 'drizzle-orm';
import { profileSchema } from '../model/schemas/profileSchema';
import { problemsToProblemPackageSchema } from '../model/schemas/intermediates/problemsToProblemPackageSchema';
import { problemSchema } from '../model/schemas/problemSchema';

const createProblemPackage = async (newPackage: NewProblemPackage) => {
    const result = await db
        .insert(problemPackageSchema)
        .values(newPackage)
        .returning();
    return result.at(0);
};

const getProblemPackageList = async () => {
    const result = await db
        .select()
        .from(problemPackageSchema)
        .innerJoin(
            profileSchema,
            eq(profileSchema.userId, problemPackageSchema.owner),
        );

    return result.map((entry) => {
        return { ...entry.problem_package, owner: entry.profiles };
    });
};

const updateProblemPackage = async (
    packageId: number,
    data: Partial<NewProblemPackage>,
) => {
    const result = await db
        .update(problemPackageSchema)
        .set(data)
        .where(eq(problemPackageSchema.id, packageId))
        .returning();
    return result.at(0);
};

const deleteProblemPackage = async (packageId: number) =>
    await db
        .delete(problemPackageSchema)
        .where(eq(problemPackageSchema.id, packageId));

const addProblemToPackage = async (packageId: number, problemId: number) => {
    const result = await db
        .insert(problemsToProblemPackageSchema)
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
        .delete(problemsToProblemPackageSchema)
        .where(
            and(
                eq(problemsToProblemPackageSchema.packageId, packageId),
                eq(problemsToProblemPackageSchema.problemId, problemId),
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
        .from(problemsToProblemPackageSchema)
        .innerJoin(
            problemSchema,
            eq(problemsToProblemPackageSchema.problemId, problemSchema.id),
        )
        .where(eq(problemsToProblemPackageSchema.packageId, packageId));

    return result.map((entry) => entry);
};

export default {
    createProblemPackage,
    getProblemPackageList,
    updateProblemPackage,
    deleteProblemPackage,
    addProblemToPackage,
    removeProblemFromPackage,
    getProblemsOfPackage,
};
