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
    .guard({
        body: t.Object({ userId: t.Number() }),
        detail: {
            tags: ['Auth'],
        },
    })
    .post('/', async ({ body }) => {
        const newAdmin = await adminRepository.addToAdmins(body.userId);
        return newAdmin ? 'Admin added' : 'Admin already added';
    })
    .delete(
        '/:userId',
        ({ params: { userId } }) => {
            adminRepository.revokeAdmin(userId);
        },
        {
            params: t.Object({
                userId: t.Number(),
            }),
        },
    );
