import { Elysia } from 'elysia';
import { authenticatedUser } from '../plugins/authenticatedUser';
import { userGroupBodies } from '../bodies/userGroupRequests';
import { userGroupResponses } from '../responses/userGroupResponses';
import { userGroupIdParam } from '../plugins/userGroupIdParam';
import { GroupService } from '../services/GroupService';
import { userGroupErrorHandler } from '../errorHandlers/userGroupErrorHandler';

export default new Elysia({
    prefix: 'user_group',
    detail: {
        tags: ['Groups'],
    },
})
    .use(authenticatedUser)
    .use(userGroupErrorHandler)
    .use(userGroupBodies)
    .use(userGroupResponses)
    .decorate({
        userGroupService: new GroupService(),
    })
    .post(
        '',
        async ({ userGroupService, user, body }) =>
            await userGroupService.createUserGroup(body, user.id),
        {
            body: 'createUserGroupRequestBody',
        },
    )
    .get(
        '',
        async ({ userGroupService }) =>
            await userGroupService.getUserGroupList(),
        {
            response: 'getUserGroupListResponse',
        },
    )
    .group(':groupId', (app) =>
        app
            .use(userGroupIdParam)
            .get(
                '',
                async ({ userGroupService, groupId }) =>
                    await userGroupService.getUserGroup(groupId),
                {
                    response: 'getUserGroupResponse',
                },
            )
            .put(
                '',
                async ({ userGroupService, body, groupId }) =>
                    await userGroupService.updateUserGroup(body, groupId),
                {
                    body: 'updateUserGroupRequestBody',
                },
            )
            .delete(
                '',
                async ({ userGroupService, groupId }) =>
                    await userGroupService.deleteUserGroup(groupId),
            )
            .group(
                'users',
                {
                    body: 'userIds',
                },
                (app) =>
                    app
                        .put(
                            '',
                            async ({ userGroupService, groupId, body }) =>
                                await userGroupService.addUsersToGroup(
                                    groupId,
                                    body.userIds,
                                ),
                        )
                        .delete(
                            '',
                            async ({ userGroupService, groupId, body }) =>
                                await userGroupService.removeUsersFromGroup(
                                    groupId,
                                    body.userIds,
                                ),
                        ),
            ),
    );
