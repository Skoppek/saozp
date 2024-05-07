import { desc, eq, lt } from 'drizzle-orm';
import {
    NewSession,
    Session,
    sessionSchema,
} from '../model/schemas/sessionSchema';
import { db } from '../model/db/db';

const createSession = async (
    session: NewSession,
): Promise<NewSession | undefined> => {
    return (await db.insert(sessionSchema).values(session).returning()).at(0);
};

const revokeSession = async (sessionId: string) => {
    return await db
        .update(sessionSchema)
        .set({ expiresAt: new Date(0) })
        .where(eq(sessionSchema.id, sessionId));
};

const getSessionById = async (id: string): Promise<Session | undefined> => {
    return (
        await db.select().from(sessionSchema).where(eq(sessionSchema.id, id))
    ).at(0);
};

const deleteExpiredSessions = async () => {
    await db
        .delete(sessionSchema)
        .where(lt(sessionSchema.expiresAt, new Date()));
};

const getLatestSessionOfUser = async (
    userId: number,
): Promise<Session | undefined> => {
    return (
        await db
            .select()
            .from(sessionSchema)
            .where(eq(sessionSchema.userId, userId))
            .orderBy(desc(sessionSchema.expiresAt))
            .limit(1)
    ).at(0);
};

const refreshSession = async (
    id: string,
    forMinutes: number,
): Promise<Session | undefined> => {
    return (
        await db
            .update(sessionSchema)
            .set({
                expiresAt: new Date(Date.now() + 1000 * 60 * forMinutes),
            })
            .where(eq(sessionSchema.id, id))
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
