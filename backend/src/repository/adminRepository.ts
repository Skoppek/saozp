import { eq } from 'drizzle-orm';
import { db } from '../model/db/db';
import { NewAdmin, adminSchema } from '../model/schemas/adminSchema';

const addToAdmins = async (userId: number): Promise<NewAdmin | undefined> => {
    return (await db.insert(adminSchema).values({ id: userId }).returning()).at(
        0,
    );
};

const isAdmin = async (userId: number) => {
    return (
        await db.select().from(adminSchema).where(eq(adminSchema.id, userId))
    ).length
        ? true
        : undefined;
};

const revokeAdmin = async (userId: number) => {
    await db.delete(adminSchema).where(eq(adminSchema.id, userId));
};

export default {
    addToAdmins,
    isAdmin,
    revokeAdmin,
};
