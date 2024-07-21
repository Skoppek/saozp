import { Elysia, t } from 'elysia';
import AdminRepository from '../repository/AdminRepository';
import { adminUserAccess } from '../plugins/adminUserAccess';
import SessionRepository from '../repository/SessionRepository';
import AuthService from '../services/AuthService';

export default new Elysia({
    prefix: 'admin',
    detail: {
        tags: ['Auth'],
    },
})
    .use(adminUserAccess)
    .post(
        '',
        async ({ body }) => {
            const newAdmin = await AdminRepository.addToAdmins(body.userId);
            return newAdmin ? 'Admin added' : 'Admin already added';
        },
        {
            body: t.Object({ userId: t.Number() }),
        },
    )
    .group(
        '/:userId',
        {
            params: t.Object({
                userId: t.Number(),
            }),
        },
        (app) =>
            app
                .post(
                    '/password_reset',
                    async ({ params: { userId } }) =>
                        await AuthService.createPasswordResetToken(userId),
                    {
                        response: t.Object({
                            token: t.String(),
                        }),
                    },
                )
                .delete('', ({ params: { userId }, user, set }) => {
                    if (userId === user.id) {
                        set.status = 400;
                        throw new Error('You cannot revoke your own role!');
                    }
                    AdminRepository.revokeAdmin(userId);
                }),
    )
    .delete(
        '/session/:id',
        async ({ params: { id }, user, set }) => {
            const session = await SessionRepository.getSessionById(id);
            if (session?.userId === user.id) {
                set.status = 400;
                throw new Error(
                    'You cannot revoke your own session! Please logout if you want to do so.',
                );
            }
            await SessionRepository.revokeSession(id);
        },
        {
            params: t.Object({
                id: t.String(),
            }),
        },
    )
    .get(
        '/users',
        async ({}) => {
            const data = await AdminRepository.getUsersAdminView();
            return data.map((item) => {
                return {
                    ...item,
                    isAdmin: !!item.adminId,
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
        },
    );
