import { Elysia } from 'elysia';
import { InternalError } from '../errors/generalErrors';
import AdminRepository from '../repository/AdminRepository';
import UserRepository from '../repository/UserRepository';
import { sessionErrorHandler } from '../errorHandlers/sessionErrorHandler';
import SessionRepository from '../repository/SessionRepository';
import {
    SessionCookieNotFoundError,
    SessionExpiredError,
    SessionNotFoundError,
} from '../errors/sessionErrors';

class UserWithSessionNotFoundError extends Error {
    constructor() {
        super('User with valid session not found. Logging out...');
    }
}

export const authenticatedUser = new Elysia()
    .use(sessionErrorHandler)
    .resolve({ as: 'global' }, async ({ cookie: { session } }) => {
        if (!session || !session.value) {
            throw new SessionCookieNotFoundError();
        }
        const sessionData = await SessionRepository.getSessionById(
            session.value,
        );
        if (!sessionData) {
            session.remove();
            throw new SessionNotFoundError();
        }
        if (sessionData.expiresAt < new Date()) {
            session.remove();
            throw new SessionExpiredError();
        }
        return {
            userId: sessionData.userId,
            sessionCookie: session,
        };
    })
    .error({
        UserWithSessionNotFoundError,
    })
    .onError(({ code, error, set }) => {
        switch (code) {
            case 'UserWithSessionNotFoundError':
                set.status = 403;
                return error;
        }
    })
    .derive({ as: 'scoped' }, async ({ userId, sessionCookie }) => {
        if (!userId || !sessionCookie) {
            throw new InternalError();
        }
        const user = await UserRepository.getUserById(userId);
        if (!user) {
            sessionCookie.remove();
            throw UserWithSessionNotFoundError;
        }

        return {
            user: {
                ...user,
                isAdmin: await AdminRepository.isAdmin(user.id),
            },
            sessionCookie,
        };
    });
