import { desc, eq, lt } from 'drizzle-orm';
import { NewSession, sessionSchema } from '../model/schemas/sessionSchema';
import { db } from '../model/db/db';

export default abstract class SessionRepository {
    static async createSession(session: NewSession) {
        const result = await db
            .insert(sessionSchema)
            .values(session)
            .returning();

        return result.at(0);
    }

    static async revokeSession(sessionId: string) {
        return db.delete(sessionSchema).where(eq(sessionSchema.id, sessionId));
    }

    static async getSessionById(id: string) {
        const result = await db
            .select()
            .from(sessionSchema)
            .where(eq(sessionSchema.id, id));

        return result.at(0);
    }

    static deleteExpiredSessions() {
        db.delete(sessionSchema).where(lt(sessionSchema.expiresAt, new Date()));
    }

    static async getLatestSessionOfUser(userId: number) {
        const result = await db
            .select()
            .from(sessionSchema)
            .where(eq(sessionSchema.userId, userId))
            .orderBy(desc(sessionSchema.expiresAt));

        return result.at(0);
    }

    static async setSessionExpiryDate(id: string, expiresAt: Date) {
        console.log({ set: expiresAt });
        const result = await db
            .update(sessionSchema)
            .set({
                expiresAt,
            })
            .where(eq(sessionSchema.id, id))
            .returning();

        return result.at(0);
    }
}
