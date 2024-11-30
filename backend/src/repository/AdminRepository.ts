import { eq } from 'drizzle-orm';
import { db } from '../db/db';
import { adminSchema } from '../db/schema/adminSchema';
import { userSchema } from '../db/schema/userSchema';
import { profileSchema } from '../db/schema/profileSchema';
import { sessionSchema } from '../db/schema/sessionSchema';

export default abstract class AdminRepository {
    static async addToAdmins(userId: number) {
        const result = await db
            .insert(adminSchema)
            .values({ id: userId })
            .returning();

        return result.at(0);
    }

    static async isAdmin(userId: number) {
        const result = await db
            .select()
            .from(adminSchema)
            .where(eq(adminSchema.id, userId));

        return result.length ? true : undefined;
    }

    static async revokeAdmin(userId: number) {
        await db.delete(adminSchema).where(eq(adminSchema.id, userId));
    }

    static async getUsersAdminView() {
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
