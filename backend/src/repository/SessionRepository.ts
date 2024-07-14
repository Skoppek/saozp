import { desc, eq, lt } from 'drizzle-orm';
import { NewSession, sessionSchema } from '../model/schemas/sessionSchema';
import { db } from '../model/db/db';

export default class SessionRepository {
    async createSession(session: NewSession) {
        const result = await db
            .insert(sessionSchema)
            .values(session)
            .returning();

        return result.at(0);
    }

    async revokeSession(sessionId: string) {
        return db
            .update(sessionSchema)
            .set({ expiresAt: new Date(0) })
            .where(eq(sessionSchema.id, sessionId));
    }

    async getSessionById(id: string) {
        const result = await db
            .select()
            .from(sessionSchema)
            .where(eq(sessionSchema.id, id));

        return result.at(0);
    }

    async deleteExpiredSessions() {
        await db
            .delete(sessionSchema)
            .where(lt(sessionSchema.expiresAt, new Date()));
    }

    async getLatestSessionOfUser(userId: number) {
        const result = await db
            .select()
            .from(sessionSchema)
            .where(eq(sessionSchema.userId, userId))
            .orderBy(desc(sessionSchema.expiresAt));

        return result.at(0);
    }

    async refreshSession(id: string, forMinutes: number) {
        const result = await db
            .update(sessionSchema)
            .set({
                expiresAt: new Date(Date.now() + 1000 * 60 * forMinutes),
            })
            .where(eq(sessionSchema.id, id))
            .returning();

        return result.at(0);
    }
}
