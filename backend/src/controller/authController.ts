import { Elysia, t } from 'elysia';
import { AuthService } from '../services/AuthService';
import { ProfileService } from '../services/ProfileService';
import { SessionService } from '../services/SessionService';
import { authenticatedUser } from '../plugins/authenticatedUser';
import sessionCookieDto from '../shared/sessionCookieDto';
import SessionRepository from '../repository/SessionRepository';
import { authErrorHandler } from '../errorHandlers/authErrorHandler';

export default new Elysia({ prefix: 'auth' })
    .use(authErrorHandler)
    .decorate({
        authService: new AuthService(),
        profileService: new ProfileService(),
        sessionService: new SessionService(),
    })
    .use(sessionCookieDto)
    .post(
        '/sign_up',
        async ({
            authService,
            profileService,
            sessionService,
            body: { login, password, lastName, firstName },
            cookie: { session },
        }) => {
            const newUser = await authService.signUp(login, password);
            await profileService.createProfile(newUser.id, firstName, lastName);
            const newSession = await sessionService.createSession(newUser.id);

            // @ts-ignore
            session.set({
                httpOnly: true,
                maxAge: 3600 * 2,
                path: '/',
                priority: 'high',
                value: newSession.id,
                sameSite: 'none',
                expires: newSession?.expiresAt,
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
        async ({
            authService,
            sessionService,
            body: { login, password },
            cookie: { session },
        }) => {
            const userId = await authService.signIn(login, password);
            const newSession = await sessionService.createSession(userId);

            session?.set({
                httpOnly: true,
                maxAge: 3600 * 2,
                path: '/',
                priority: 'high',
                value: newSession.id,
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
        async ({ authService, body: { token, newPassword } }) =>
            await authService.resetPassword(token, newPassword),
        {
            body: t.Object({
                token: t.String(),
                newPassword: t.String(),
            }),
        },
    )
    .use(authenticatedUser)
    .decorate({
        sessionRepository: new SessionRepository(),
    })
    .delete(
        '/logout',
        async ({ sessionRepository, sessionCookie }) => {
            await sessionRepository.revokeSession(sessionCookie.value);
            sessionCookie.remove();
        },
        {
            detail: {
                tags: ['Auth'],
            },
        },
    );
