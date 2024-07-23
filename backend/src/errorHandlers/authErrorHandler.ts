import { Elysia } from 'elysia';
import {
    PasswordMarkedForResetError,
    PasswordResetTokenNotFoundError,
    UserNotFoundError,
} from '../errors/authErrors';
import { HttpStatusCode } from 'elysia-http-status-code';

export const authErrorHandler = new Elysia()
    .error({
        PasswordMarkedForResetError,
        PasswordResetTokenNotFoundError,
        UserNotFoundError,
    })
    .use(HttpStatusCode())
    .onError({ as: 'scoped' }, ({ code, error, set, httpStatus }) => {
        switch (code) {
            case 'PasswordMarkedForResetError':
                set.status = httpStatus.HTTP_307_TEMPORARY_REDIRECT;
                return error;
            case 'PasswordResetTokenNotFoundError':
            case 'UserNotFoundError':
                set.status = httpStatus.HTTP_404_NOT_FOUND;
                return error;
        }
    });
