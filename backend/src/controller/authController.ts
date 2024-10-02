import { Elysia, t } from 'elysia';
import { ProfileService } from '../services/ProfileService';
import { SessionService } from '../services/SessionService';
import { authenticatedUser } from '../plugins/authenticatedUser';
import SessionRepository from '../repository/SessionRepository';
import { authErrorHandler } from '../errorHandlers/authErrorHandler';
import AuthService from '../services/AuthService';

export default new Elysia({ prefix: 'auth' })
    .use(authErrorHandler)
    .post(
        '/sign_up',
        async ({ body: { login, password, lastName, firstName }, cookie }) => {
            const newUser = await AuthService.signUp(login, password);
            await ProfileService.createProfile(newUser.id, firstName, lastName);
            const newSession = await SessionService.createSession(newUser.id);

            cookie.session?.set({
                value: newSession.id,
                httpOnly: true,
                path: '/',
                sameSite: 'none',
                expires: newSession.expiresAt,
                secure: true,
            });
        },
        {
            detail: {
                tags: ['Auth'],
            },
            body: t.Object({
                login: t.String(),
                password: t.String(),
                firstName: t.String(),
                lastName: t.String(),
            }),
        },
    )
    .post(
        '/sign_in',
        async ({ body: { login, password }, cookie }) => {
            const userId = await AuthService.signIn(login, password);
            const newSession = await SessionService.createSession(userId);

            cookie.session?.set({
                value: newSession.id,
                httpOnly: true,
                path: '/',
                sameSite: 'none',
                expires: newSession.expiresAt,
                secure: true,
            });
        },
        {
            detail: {
                tags: ['Auth'],
            },
            body: t.Object({
                login: t.String(),
                password: t.String(),
            }),
        },
    )
    .post(
        '/password_reset',
        async ({ body: { token, newPassword, login } }) =>
            await AuthService.resetPassword(token, newPassword, login),
        {
            body: t.Object({
                login: t.String(),
                token: t.String(),
                newPassword: t.String(),
            }),
        },
    )
    .use(authenticatedUser)
    .delete(
        '/logout',
        async ({ cookie: { session } }) => {
            await SessionRepository.revokeSession(session.value);
            session.remove();
        },
        {
            cookie: t.Object({
                session: t.String(),
            }),
            detail: {
                tags: ['Auth'],
            },
        },
    );
