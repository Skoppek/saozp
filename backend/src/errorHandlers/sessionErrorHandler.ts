import { Elysia } from 'elysia';
import {
    SessionCookieNotFoundError,
    SessionExpiredError,
    SessionNotFoundError,
} from '../errors/sessionErrors';
import { HttpStatusCode } from 'elysia-http-status-code';

export const sessionErrorHandler = new Elysia()
    .error({
        SessionCookieNotFoundError,
        SessionExpiredError,
        SessionNotFoundError,
    })
    .use(HttpStatusCode())
    .onError({ as: 'scoped' }, ({ code, error, set, httpStatus }) => {
        switch (code) {
            case 'SessionCookieNotFoundError':
            case 'SessionNotFoundError':
            case 'SessionExpiredError':
                set.status = httpStatus.HTTP_401_UNAUTHORIZED;
                return error;
        }
    });
