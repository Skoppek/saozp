import { Elysia } from 'elysia';
import sessionRepository from '../repository/sessionRepository';

class SessionCookieNotFoundError extends Error {
    constructor() {
        super('Session cookie not found');
    }
}

class SessionExpiredError extends Error {
    constructor() {
        super('Session expired');
    }
}

class SessionNotFound extends Error {
    constructor() {
        super('Session not found.');
    }
}

export const sessionCookie = new Elysia()
    .error({
        SessionCookieNotFoundError,
        SessionExpiredError,
        SessionNotFound,
    })
    .onError(({ code, error, set }) => {
        switch (code) {
            case 'SessionCookieNotFoundError':
            case 'SessionExpiredError':
            case 'SessionNotFound':
                set.status = 401;
                return error;
        }
    })
    .derive({ as: 'local' }, async ({ cookie: { session } }) => {
        if (!session || !session.value) {
            throw new SessionCookieNotFoundError();
        }
        const sessionData = await sessionRepository.getSessionById(
            session.value,
        );
        if (!sessionData) {
            session.remove();
            throw new SessionNotFound();
        }
        if (sessionData.expiresAt < new Date()) {
            session.remove();
            throw new SessionExpiredError();
        }
        return {
            userId: sessionData.userId,
        };
    })
    .propagate();
