import { eq } from 'drizzle-orm';
import { db } from '../model/db/db';
import { NewAdmin, admins } from '../model/schemas/adminSchema';

const addToAdmins = async (userId: number): Promise<NewAdmin | undefined> => {
    return (await db.insert(admins).values({ id: userId }).returning()).at(0);
};

const isAdmin = async (userId: number): Promise<boolean> => {
    return (await db.select().from(admins).where(eq(admins.id, userId))).length
        ? true
        : false;
};

const revokeAdmin = async (userId: number) => {
    await db.delete(admins).where(eq(admins.id, userId));
};

export default {
    addToAdmins,
    isAdmin,
    revokeAdmin,
};
