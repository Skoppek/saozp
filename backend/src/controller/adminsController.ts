import { Elysia, t } from 'elysia';
import sessionRepository from '../repository/sessionRepository';
import adminRepository from '../repository/adminRepository';

export default new Elysia({ prefix: '/admin' })
    .derive(async ({ cookie: { session }, set }) => {
        if (!session || !session.value) {
            set.status = 401;
            throw new Error('Unauthorized');
        }
        const sessionData = await sessionRepository.getSessionById(
            session.value,
        );
        if (!sessionData || sessionData.expiresAt < new Date()) {
            set.status = 401;
            throw new Error('Unauthorized');
        }
        if (!sessionData.userId) {
            set.status = 500;
            throw new Error('User not found for session!');
        }
        const isAdmin = await adminRepository.isAdmin(sessionData.userId);
        return {
            user: {
                userId: sessionData.userId,
                isAdmin,
            },
        };
    })
    .onBeforeHandle(({ set, user }) => {
        if (!user.isAdmin) {
            set.status = 403;
            throw new Error('Unauthorized');
        }
    })
    .post(
        '/',
        async ({ body }) => {
            const newAdmin = await adminRepository.addToAdmins(body.userId);
            return newAdmin ? 'Admin added' : 'Admin already added';
        },
        {
            body: t.Object({ userId: t.Number() }),
            detail: {
                tags: ['Auth'],
            },
        },
    )
    .delete(
        '/:userId',
        ({ params: { userId }, user, set }) => {
            const id = parseInt(userId);
            if (id === user.userId) {
                set.status = 400;
                throw new Error('You cannot revoke your own role!');
            }
            adminRepository.revokeAdmin(id);
        },
        {
            params: t.Object({
                userId: t.String(),
            }),
            detail: {
                tags: ['Auth'],
            },
        },
    )
    .delete(
        '/session/:id',
        async ({ params: { id }, user, set }) => {
            const session = await sessionRepository.getSessionById(id);
            if (session?.userId === user.userId) {
                set.status = 400;
                throw new Error(
                    'You cannot revoke your own session! Please logout if you want to do so.',
                );
            }
            await sessionRepository.revokeSession(id);
        },
        {
            params: t.Object({
                id: t.String(),
            }),
            detail: {
                tags: ['Auth'],
            },
        },
    )
    .get(
        '/users',
        async () => {
            const data = await adminRepository.getUsersAdminView();
            return data.map((item) => {
                return {
                    ...item,
                    isAdmin: item.adminId ? true : undefined,
                    sessionId: item.sessionId ?? undefined,
                    sessionExpiryDate: item.sessionExpiryDate ?? undefined,
                };
            });
        },
        {
            response: t.Array(
                t.Object({
                    userId: t.Number(),
                    login: t.String(),
                    firstName: t.String(),
                    lastName: t.String(),
                    isAdmin: t.Optional(t.Boolean()),
                    sessionId: t.Optional(t.String()),
                    sessionExpiryDate: t.Optional(t.Date()),
                }),
            ),
            detail: {
                tags: ['Auth'],
            },
        },
    );
