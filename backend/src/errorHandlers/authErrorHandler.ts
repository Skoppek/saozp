import { Elysia } from 'elysia';
import {
    PasswordMarkedForResetError,
    PasswordResetTokenNotFoundError,
    PasswordResetWrongLoginError,
    UserNotFoundError,
} from '../errors/authErrors';

export const authErrorHandler = new Elysia()
    .error({
        PasswordMarkedForResetError,
        PasswordResetTokenNotFoundError,
        PasswordResetWrongLoginError,
        UserNotFoundError,
    })
    .onError({ as: 'scoped' }, ({ code, error, set }) => {
        switch (code) {
            case 'PasswordMarkedForResetError':
                set.status = 418;
                return error;
            case 'PasswordResetTokenNotFoundError':
            case 'PasswordResetWrongLoginError':
            case 'UserNotFoundError':
                set.status = 404;
                return error;
        }
    });
