import Elysia from 'elysia';
import profileRepository from '../repository/profileRepository';
import { authenticatedUser } from '../plugins/authenticatedUser';
import { profileErrorHandler } from '../errorHandlers/profileErrorHandler';
import { ProfileNotFoundError } from '../errors/profileErrors';
import { profileResponse } from '../responses/profileResponse';

export default new Elysia()
    .use(authenticatedUser)
    .use(profileErrorHandler)
    .use(profileResponse)
    .get(
        '/me',
        async ({ user: { id, login, isAdmin } }) => {
            const profile = await profileRepository.getProfileByUserId(id);

            if (!profile) {
                throw new ProfileNotFoundError();
            }

            return {
                ...profile,
                login,
                isAdmin,
            };
        },
        {
            detail: {
                tags: ['Profiles'],
            },
            response: 'profileResponse',
        },
    );
