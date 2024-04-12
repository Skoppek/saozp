import { desc, eq, lt } from 'drizzle-orm';
import { NewSession, Session, sessions } from '../model/schemas/sessionSchema';
import { db } from '../model/db/db';

const createSession = async (
    session: NewSession,
): Promise<NewSession | undefined> => {
    return (await db.insert(sessions).values(session).returning()).at(0);
};

const revokeSession = async (sessionId: string) => {
    return await db
        .update(sessions)
        .set({ expiresAt: new Date(0) })
        .where(eq(sessions.id, sessionId));
};

const getSessionById = async (id: string): Promise<Session | undefined> => {
    return (await db.select().from(sessions).where(eq(sessions.id, id))).at(0);
};

const deleteExpiredSessions = async () => {
    await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
};

const getLatestSessionOfUser = async (
    userId: number,
): Promise<Session | undefined> => {
    return (
        await db
            .select()
            .from(sessions)
            .where(eq(sessions.userId, userId))
            .orderBy(desc(sessions.expiresAt))
            .limit(1)
    ).at(0);
};

const refreshSession = async (
    id: string,
    forMinutes: number,
): Promise<Session | undefined> => {
    return (
        await db
            .update(sessions)
            .set({
                expiresAt: new Date(Date.now() + 1000 * 60 * forMinutes),
            })
            .where(eq(sessions.id, id))
            .returning()
    ).at(0);
};

export default {
    createSession,
    getSessionById,
    revokeSession,
    refreshSession,
    getLatestSessionOfUser,
    deleteExpiredSessions,
};
