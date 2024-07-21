import { Elysia, t } from 'elysia';
import { generalErrorHandler } from './errorHandlers/generalErrorHandler';
import { sessionCleaner } from './plugins/sessionCleaner';
import { corsSettings } from './plugins/corsSettings';
import { controller } from './controller/controller';
import { initAdmin } from './shared/init';
import { swagger } from '@elysiajs/swagger';
import swaggerConfig from './plugins/swaggerConfig';
import { passwordResetTokenCleaner } from './plugins/passwordResetTokenCleaner';
import authController from './controller/authController';
import { authErrorHandler } from './errorHandlers/authErrorHandler';
import { ProfileService } from './services/ProfileService';
import { SessionService } from './services/SessionService';
import { authenticatedUser } from './plugins/authenticatedUser';
import SessionRepository from './repository/SessionRepository';
import AuthService from './services/AuthService';

const app = new Elysia()
    .group('auth', (app) =>
        app
            .use(authErrorHandler)
            .post(
                '/sign_up',
                async ({
                    body: { login, password, lastName, firstName },
                    cookie: { session },
                }) => {
                    const newUser = await AuthService.signUp(login, password);
                    await ProfileService.createProfile(
                        newUser.id,
                        firstName,
                        lastName,
                    );
                    const newSession = await SessionService.createSession(
                        newUser.id,
                    );

                    session.set({
                        httpOnly: false,
                        maxAge: 3600 * 2,
                        path: '/',
                        priority: 'high',
                        value: newSession.id,
                        sameSite: 'none',
                        expires: newSession?.expiresAt,
                        secure: false,
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
                    cookie: t.Object({
                        session: t.String(),
                    }),
                },
            )
            .post(
                '/sign_in',
                async ({ body: { login, password }, cookie: { session } }) => {
                    const userId = await AuthService.signIn(login, password);
                    const newSession =
                        await SessionService.createSession(userId);

                    session.set({
                        value: newSession.id,
                        httpOnly: false,
                        maxAge: 3600 * 2,
                        path: '/',
                        priority: 'high',
                        sameSite: 'none',
                        expires: newSession.expiresAt,
                        secure: false,
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
                    cookie: t.Object({
                        session: t.String(),
                    }),
                },
            )
            .post(
                '/password_reset',
                async ({ body: { token, newPassword } }) =>
                    await AuthService.resetPassword(token, newPassword),
                {
                    body: t.Object({
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
            ),
    )
    .use(generalErrorHandler)
    .use(corsSettings)
    .use(swagger(swaggerConfig))
    .use(sessionCleaner)
    .use(passwordResetTokenCleaner)
    .use(authController)
    .use(controller);

try {
    await initAdmin();
    app.listen(3000);
    console.log(
        `Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
    );
} catch (error) {
    let message = 'Unknown Error';
    if (error instanceof Error) message = error.message;
    // we'll proceed, but let's report it
    console.error(message);
}

export type App = typeof app;
