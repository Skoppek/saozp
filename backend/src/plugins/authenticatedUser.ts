import { Elysia } from 'elysia';
import { InternalError } from '../errors/generalErrors';
import AdminRepository from '../repository/AdminRepository';
import UserRepository from '../repository/UserRepository';
import {sessionErrorHandler} from "../errorHandlers/sessionErrorHandler";
import sessionCookieDto from "../shared/sessionCookieDto";
import SessionRepository from "../repository/SessionRepository";
import {SessionCookieNotFoundError, SessionExpiredError, SessionNotFoundError} from "../errors/sessionErrors";

class UserWithSessionNotFoundError extends Error {
    constructor() {
        super('User with valid session not found. Logging out...');
    }
}

export const authenticatedUser = new Elysia()
    .use(sessionErrorHandler)
    .use(sessionCookieDto)
    .guard({ cookie: 'sessionCookieDto' })
    .decorate({
        sessionRepository: new SessionRepository(),
    })
    .derive(
        { as: 'scoped' },
        async ({ sessionRepository, cookie: { session } }) => {
            if (!session || !session.value) {
                throw new SessionCookieNotFoundError();
            }
            const sessionData = await sessionRepository.getSessionById(
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
        },
    )
    .decorate({
        adminRepository: new AdminRepository(),
        userRepository: new UserRepository(),
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
    .derive(
        { as: 'scoped' },
        async ({ adminRepository, userRepository, userId, sessionCookie }) => {
            if (!userId || !sessionCookie) {
                throw new InternalError();
            }
            const user = await userRepository.getUserById(userId);
            if (!user) {
                sessionCookie.remove();
                throw UserWithSessionNotFoundError;
            }

            return {
                user: {
                    ...user,
                    isAdmin: await adminRepository.isAdmin(user.id),
                },
                sessionCookie,
            };
        },
    );
