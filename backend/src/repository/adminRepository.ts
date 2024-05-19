import { eq } from 'drizzle-orm';
import { db } from '../model/db/db';
import { NewAdmin, adminSchema } from '../model/schemas/adminSchema';
import { userSchema } from '../model/schemas/userSchema';
import { profileSchema } from '../model/schemas/profileSchema';
import { sessionSchema } from '../model/schemas/sessionSchema';

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

const getUsersAdminView = async () => {
    return await db
        .select({
            userId: userSchema.id,
            login: userSchema.login,
            firstName: profileSchema.firstName,
            lastName: profileSchema.lastName,
            adminId: adminSchema.id,
            sessionId: sessionSchema.id,
            sessionExpiryDate: sessionSchema.expiresAt,
        })
        .from(userSchema)
        .innerJoin(profileSchema, eq(userSchema.id, profileSchema.userId))
        .leftJoin(adminSchema, eq(userSchema.id, adminSchema.id))
        .leftJoin(sessionSchema, eq(userSchema.id, sessionSchema.userId));
};

export default {
    addToAdmins,
    getUsersAdminView,
    isAdmin,
    revokeAdmin,
};
