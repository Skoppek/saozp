import { Elysia } from 'elysia';
import { authenticatedUser } from '../plugins/authenticatedUser';
import { NotImplementedError } from '../errors/generalErrors';
import { userGroupRequestBodies } from '../requests/userGroupRequests';
import { userGroupResponses } from '../responses/userGroupResponses';
import { userGroupIdParam } from '../plugins/userGroupIdParam';
import { UserGroupService } from '../services/UserGroupService';
import { userGroupErrorHandler } from '../errorHandlers/userGroupErrorHandler';

export default new Elysia({ prefix: 'user_group' })
    .use(authenticatedUser)
    .use(userGroupErrorHandler)
    .use(userGroupRequestBodies)
    .use(userGroupResponses)
    .decorate({
        userGroupService: new UserGroupService(),
    })
    .post(
        '/',
        async ({ userGroupService, user, body }) =>
            await userGroupService.createUserGroup(body, user.id),
        {
            body: 'createUserGroupRequestBody',
        },
    )
    .get(
        '/',
        async ({ userGroupService }) =>
            await userGroupService.getUserGroupList(),
        {
            response: 'getUserGroupListResponse',
        },
    )
    .group('/:groupId', (app) =>
        app
            .use(userGroupIdParam)
            .get(
                '/',
                ({ groupId }) => {
                    throw new NotImplementedError();
                },
                {
                    response: 'getUserGroupResponse',
                },
            )
            .put(
                '/',
                ({ groupId }) => {
                    throw new NotImplementedError();
                },
                {
                    body: 'updateUserGroupRequestBody',
                },
            )
            .delete('/', ({ groupId }) => {
                throw new NotImplementedError();
            })
            .group(
                '/users',
                {
                    body: 'userIds',
                },
                (app) =>
                    app
                        .put('/', ({ groupId }) => {
                            throw new NotImplementedError();
                        })
                        .delete('/', ({ groupId }) => {
                            throw new NotImplementedError();
                        }),
            ),
    );
