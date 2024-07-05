import Elysia, { t } from 'elysia';
import profileRepository from '../repository/profileRepository';
import adminRepository from '../repository/adminRepository';

import { authenticatedUser } from '../plugins/authenticatedUser';

export default new Elysia().use(authenticatedUser).get(
    '/me',
    async ({ user: { id, login }, set }) => {
        const profile = await profileRepository.getProfileByUserId(id);

        if (!profile) {
            set.status = 500;
            throw new Error('No profile found for logged user!');
        }

        const isAdmin = await adminRepository.isAdmin(id);

        return {
            userId: id,
            login,
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
