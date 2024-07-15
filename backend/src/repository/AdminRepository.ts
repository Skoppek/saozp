import { eq } from 'drizzle-orm';
import { db } from '../model/db/db';
import { adminSchema } from '../model/schemas/adminSchema';
import { userSchema } from '../model/schemas/userSchema';
import { profileSchema } from '../model/schemas/profileSchema';
import { sessionSchema } from '../model/schemas/sessionSchema';

export default class AdminRepository {
    async addToAdmins(userId: number) {
        const result = await db
            .insert(adminSchema)
            .values({ id: userId })
            .returning();

        return result.at(0);
    }

    async isAdmin(userId: number) {
        const result = await db
            .select()
            .from(adminSchema)
            .where(eq(adminSchema.id, userId));

        return result.length ? true : undefined;
    }

    async revokeAdmin(userId: number) {
        await db.delete(adminSchema).where(eq(adminSchema.id, userId));
    }

    async getUsersAdminView() {
        return db
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
    }
}