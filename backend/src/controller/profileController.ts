import Elysia from 'elysia';
import { authenticatedUser } from '../plugins/authenticatedUser';
import { profileErrorHandler } from '../errorHandlers/profileErrorHandler';
import { profileResponses } from '../responses/profileResponses';
import { ProfileService } from '../services/ProfileService';

export default new Elysia()
    .use(authenticatedUser)
    .use(profileErrorHandler)
    .use(profileResponses)
    .get(
        '/me',
        async ({ user: { id, login, isAdmin } }) => {
            return {
                ...(await ProfileService.getProfileByUserId(id)),
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
