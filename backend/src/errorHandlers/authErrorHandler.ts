import { Elysia } from 'elysia';
import {
    PasswordMarkedForResetError,
    PasswordResetTokenNotFoundError,
    PasswordResetWrongLoginError,
    UserNotFoundError,
} from '../errors/authErrors';
import { HttpStatusCode } from 'elysia-http-status-code';

export const authErrorHandler = new Elysia()
    .error({
        PasswordMarkedForResetError,
        PasswordResetTokenNotFoundError,
        PasswordResetWrongLoginError,
        UserNotFoundError,
    })
    .use(HttpStatusCode())
    .onError({ as: 'scoped' }, ({ code, error, set, httpStatus }) => {
        switch (code) {
            case 'PasswordMarkedForResetError':
                set.status = httpStatus.HTTP_418_IM_A_TEAPOT;
                return error;
            case 'PasswordResetTokenNotFoundError':
            case 'PasswordResetWrongLoginError':
            case 'UserNotFoundError':
                set.status = httpStatus.HTTP_404_NOT_FOUND;
                return error;
        }
    });
