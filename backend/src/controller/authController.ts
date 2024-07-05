import { Elysia, t } from 'elysia';
import { cron } from '@elysiajs/cron';
import userRepository from '../repository/userRepository';
import sessionRepository from '../repository/sessionRepository';
import profileRepository from '../repository/profileRepository';
import { authenticatedUser } from '../plugins/authenticatedUser';

const getSaltedPassword = (password: string) => {
    return password + Bun.env.PASSWORD_SALT ?? '';
};

export const registerUser = async (login: string, password: string) => {
    const saltedPassword = getSaltedPassword(password);
    const hashedPassword = await Bun.password.hash(saltedPassword);

    return await userRepository.createUser({
        login,
        password: hashedPassword,
    });
};

export default new Elysia()
    .post(
        '/sign-up',
        async ({ body, cookie, set }) => {
            const { login, password, firstName, lastName } = body;

            const user = await userRepository.getUserByLogin(login);
            if (user) {
                set.status = 409;
                throw new Error('User with this email already exists!');
            }

            const newUser = await registerUser(login, password);

            if (!newUser || !newUser.id) {
                set.status = 500;
                throw new Error('User creation failure!');
            }

            const newSession = await sessionRepository.createSession({
                userId: newUser.id,
                expiresAt: new Date(Date.now() + 1000 * 3600 * 2),
            });

            if (!newSession?.id) {
                set.status = 500;
                throw new Error('Failed to create session');
            }

            // @ts-ignore
            cookie.session.set({
                httpOnly: true,
                maxAge: 3600 * 2,
                path: '/',
                priority: 'high',
                value: newSession.id,
                sameSite: 'none',
                expires: newSession?.expiresAt,
                secure: true,
            });

            return await profileRepository.createProfile({
                userId: newUser.id,
                firstName: firstName,
                lastName: lastName,
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
        async ({ body, cookie, set }) => {
            const { login, password } = body;

            const user = await userRepository.getUserByLogin(login);
            if (!user) {
                set.status = 400;
                throw new Error('User not found!');
            }

            if (
                !Bun.password.verifySync(
                    getSaltedPassword(password),
                    user.password,
                )
            ) {
                set.status = 401;
                throw new Error('Unauthenticated');
            }

            const existingSession =
                await sessionRepository.getLatestSessionOfUser(user.id);

            const sessionData =
                existingSession && existingSession.expiresAt > new Date()
                    ? await sessionRepository.refreshSession(
                          existingSession.id,
                          60 * 2,
                      )
                    : await sessionRepository.createSession({
                          userId: user.id,
                          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 2),
                      });

            if (!sessionData?.id) {
                throw new Error('Failed to create session');
            }

            cookie.session?.set({
                httpOnly: true,
                maxAge: 3600 * 2,
                path: '/',
                priority: 'high',
                value: sessionData.id,
                sameSite: 'none',
                expires: sessionData?.expiresAt,
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
