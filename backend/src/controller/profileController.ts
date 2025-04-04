import Elysia from 'elysia';
import { authenticatedUser } from '../plugins/authenticatedUser';
import { profileErrorHandler } from '../errorHandlers/profileErrorHandler';
import { profileResponses } from '../responses/profileResponses';
import { ProfileService } from '../services/ProfileService';

export default new Elysia()
    .use(authenticatedUser)
    .use(profileErrorHandler)
    .use(profileResponses)
    .get('/all', async ({}) => await ProfileService.getAllProfiles(), {
        response: 'profileList',
    })
    .get(
        '/me',
        async ({ user: { id, login, isAdmin } }) => ({
            ...(await ProfileService.getProfileByUserId(id)),
            login,
            isAdmin,
        }),
        {
            response: 'profileResponse',
        },
    );
