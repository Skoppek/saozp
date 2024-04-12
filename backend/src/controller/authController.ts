import { Elysia, t } from 'elysia';
import { cron } from '@elysiajs/cron';
import * as EmailValidator from 'email-validator';
import userRepository from '../repository/userRepository';
import sessionRepository from '../repository/sessionRepository';
import profileRepository from '../repository/profileRepository';

export default new Elysia()
    .post(
        '/sign-up',
        async ({ body, cookie: { session } }) => {
            const { email, password, firstName, lastName } = body;

            const user = (await userRepository.getUserByEmail(email)).at(0);
            if (user) {
                throw new Error('User already exists!');
            }

            if (!EmailValidator.validate(email)) {
                throw new Error('Invalid email!');
            }

            const passwordHash = Bun.password.hashSync(password);

            const newUser = (
                await userRepository.createUser({
                    email,
                    password: passwordHash,
                })
            ).at(0);

            if (!newUser || !newUser.id) {
                throw new Error('User creation failure!');
            }

            const newSession = await sessionRepository.createSession({
                userId: newUser.id,
                expiresAt: new Date(Date.now() + 1000 * 60 * 15),
            });

            if (!newSession?.id) {
                throw new Error('Failed to create session');
            }

            // @ts-ignore
            session.set({
                value: newSession.id,
                httpOnly: true,
            });

            const newProfile = (
                await profileRepository.createProfile({
                    userId: newUser.id,
                    firstName: firstName,
                    lastName: lastName,
                })
            ).at(0);

            return {
                firstName: newProfile?.firstName ?? '',
                lastName: newProfile?.lastName ?? '',
            };
        },
        {
            detail: {
                tags: ['Auth'],
            },
            body: t.Object({
                email: t.String({ format: 'email' }),
                password: t.String(),
                firstName: t.String(),
                lastName: t.String(),
            }),
            response: t.Object({
                firstName: t.String(),
                lastName: t.String(),
            }),
        },
    )
    .post(
        '/sign-in',
        async ({ body, cookie: { session } }) => {
            const { email, password } = body;

            const user = (await userRepository.getUserByEmail(email)).at(0);
            if (!user) {
                throw new Error('User not found!');
            }

            if (!Bun.password.verifySync(password, user.password)) {
                throw new Error('Unauthenticated');
            }

            const existingSession =
                await sessionRepository.getLatestSessionOfUser(user.id);

            const sessionData =
                existingSession && existingSession.expiresAt > new Date()
                    ? await sessionRepository.refreshSession(
                          existingSession.id,
                          15,
                      )
                    : await sessionRepository.createSession({
                          userId: user.id,
                          expiresAt: new Date(Date.now() + 1000 * 60 * 15),
                      });

            if (!sessionData?.id) {
                throw new Error('Failed to create session');
            }

            // @ts-ignore
            session.set({
                value: sessionData.id,
                expires: sessionData?.expiresAt,
                httpOnly: true,
            });

            return { session: sessionData.id };
        },
        {
            detail: {
                tags: ['Auth'],
            },
            body: t.Object({
                email: t.String(),
                password: t.String(),
            }),
            response: t.Object({
                session: t.String(),
            }),
        },
    )
    .put(
        '/logout',
        async ({ cookie: { session }, set }) => {
            if (!session) {
                set.status = 400;
                throw new Error('No session id in cookie!');
            }
            await sessionRepository.revokeSession(session.value);

            session.remove();
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
                15,
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
    .use(
        cron({
            name: 'delete-expired-sessions',
            pattern: '* * */1 * * *',
            run() {
                sessionRepository.deleteExpiredSessions();
            },
        }),
    );
