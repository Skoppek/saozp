import { Elysia, t } from 'elysia';
import { cron } from '@elysiajs/cron';
import sessionRepository from '../repository/sessionRepository';
import { authenticatedUser } from '../plugins/authenticatedUser';
import { AuthService } from '../services/AuthService';
import { ProfileService } from '../services/ProfileService';
import { SessionService } from '../services/SessionService';
import { sessionCookieDto } from '../shared/dtos';

export default new Elysia()
    .decorate({
        authService: new AuthService(),
        profileService: new ProfileService(),
        sessionService: new SessionService(),
    })
    .use(sessionCookieDto)
    .post(
        '/sign-up',
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
        '/sign-in',
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
    .delete(
        '/logout',
        async ({ cookie }) => {
            if (!cookie.session || !cookie.session.value) {
                return 'Cookie not found';
            }
            await sessionRepository.revokeSession(cookie.session.value);
            cookie.session.remove();
        },
        {
            detail: {
                tags: ['Auth'],
            },
        },
    )
    .put(
        '/refresh',
        async ({ cookie: { session }, set }) => {
            if (!session) {
                set.status = 401;
                throw new Error('Session cookie not found');
            }

            const refreshedSession = await sessionRepository.refreshSession(
                session.value,
                120,
            );

            if (!refreshedSession) {
                set.status = 401;
                throw new Error('Session not found');
            }

            session.expires = refreshedSession.expiresAt;
        },
        {
            detail: {
                tags: ['Auth'],
            },
        },
    )
    .group('/is-logged', (app) =>
        app.use(authenticatedUser).get('/', ({ user }) => {
            return !!user;
        }),
    )
    .use(
        cron({
            name: 'delete-expired-sessions',
            pattern: '* * */1 * * *',
            run() {
                sessionRepository.deleteExpiredSessions();
            },
        }),
    );
