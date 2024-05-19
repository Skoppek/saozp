import Elysia, { t } from 'elysia';
import sessionRepository from '../repository/sessionRepository';
import profileRepository from '../repository/profileRepository';
import adminRepository from '../repository/adminRepository';
import userRepository from '../repository/userRepository';

export default new Elysia()
    .derive(async ({ cookie: { session }, set }) => {
        if (!session || !session.value) {
            set.status = 401;
            throw new Error('Session cookie not found');
        }
        const sessionData = await sessionRepository.getSessionById(
            session.value,
        );
        if (!sessionData) {
            set.status = 401;
            throw new Error('No session cookie found');
        }
        if (sessionData.expiresAt < new Date()) {
            set.status = 401;
            throw new Error('Session expired');
        }
        if (!sessionData.userId) {
            set.status = 500;
            throw new Error('User not found for session!');
        }
        return {
            userId: sessionData.userId,
        };
    })
    .get(
        '/me',
        async ({ userId, set }) => {
            const profile = await profileRepository.getProfileByUserId(userId);
            const user = await userRepository.getUserById(userId);

            if (!profile || !user) {
                set.status = 500;
                throw new Error('No profile or user found for logged user!');
            }

            const isAdmin = await adminRepository.isAdmin(userId);

            return {
                userId,
                login: user.login,
                firstName: profile.firstName,
                lastName: profile.lastName,
                isAdmin,
            };
        },
        {
            detail: {
                tags: ['Profiles'],
            },
            response: t.Object({
                userId: t.Number(),
                login: t.String(),
                firstName: t.String(),
                lastName: t.String(),
                isAdmin: t.Optional(t.Boolean()),
            }),
        },
    );
