import { Elysia } from 'elysia';
import sessionRepository from '../repository/sessionRepository';
import {
    SessionCookieNotFoundError,
    SessionExpiredError,
    SessionNotFoundError,
} from '../errors/sessionErrors';
import { sessionErrorHandler } from '../errorHandlers/sessionErrorHandler';
import { sessionCookieDto } from '../shared/dtos';

export const sessionCookie = new Elysia()
    .use(sessionErrorHandler)
    .use(sessionCookieDto)
    .guard({ cookie: 'sessionCookieDto' })
    .derive({ as: 'scoped' }, async ({ cookie: { session } }) => {
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
    });
