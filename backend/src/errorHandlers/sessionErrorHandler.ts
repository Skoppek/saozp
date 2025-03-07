import { Elysia } from 'elysia';
import {
    SessionCookieNotFoundError,
    SessionExpiredError,
    SessionNotFoundError,
} from '../errors/sessionErrors';

export const sessionErrorHandler = new Elysia()
    .error({
        SessionCookieNotFoundError,
        SessionExpiredError,
        SessionNotFoundError,
    })
    .onError({ as: 'scoped' }, ({ code, error, set }) => {
        switch (code) {
            case 'SessionCookieNotFoundError':
            case 'SessionNotFoundError':
            case 'SessionExpiredError':
                set.status = 401;
                return error;
        }
    });
