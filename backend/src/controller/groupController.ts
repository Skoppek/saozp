import { Elysia } from 'elysia';
import { authenticatedUser } from '../plugins/authenticatedUser';
import { groupBodies } from '../bodies/groupRequests';
import { groupResponses } from '../responses/groupResponses';
import { GroupService } from '../services/GroupService';
import { groupErrorHandler } from '../errorHandlers/groupErrorHandler';
import { groupIdParam } from '../plugins/groupIdParam';

export default new Elysia({
    prefix: 'group',
    detail: {
        tags: ['Groups'],
    },
})
    .use(authenticatedUser)
    .use(groupErrorHandler)
    .use(groupBodies)
    .use(groupResponses)
    .decorate({
        groupService: new GroupService(),
    })
    .post(
        '',
        async ({ groupService, user, body }) =>
            await groupService.createGroup(body, user.id),
        {
            body: 'createGroupBody',
        },
    )
    .get(
        '',
        async ({ groupService, userId }) =>
            await groupService.getGroupsOfOwner(userId),
        {
            response: 'getGroupListResponse',
        },
    )
    .group('/:groupId', (app) =>
        app
            .use(groupIdParam)
            .get(
                '',
                async ({ groupService, groupId }) =>
                    await groupService.getGroup(groupId),
                {
                    response: 'getGroupResponse',
                },
            )
            .put(
                '',
                async ({ groupService, body, groupId }) =>
                    await groupService.updateGroup(body, groupId),
                {
                    body: 'updateGroupBody',
                },
            )
            .delete(
                '',
                async ({ groupService, groupId }) =>
                    await groupService.deleteGroup(groupId),
            )
            .group('/users', (app) =>
                app
                    .get(
                        '',
                        async ({ groupService, groupId }) =>
                            await groupService.getUsersOfGroup(groupId),
                        {
                            response: 'getUsersList',
                        },
                    )
                    .group(
                        '',
                        {
                            body: 'userIds',
                        },
                        (app) =>
                            app
                                .put(
                                    '',
                                    async ({ groupService, groupId, body }) =>
                                        await groupService.addUsersToGroup(
                                            groupId,
                                            body.userIds,
                                        ),
                                )
                                .delete(
                                    '',
                                    async ({ groupService, groupId, body }) =>
                                        await groupService.removeUsersFromGroup(
                                            groupId,
                                            body.userIds,
                                        ),
                                ),
                    ),
            ),
    );
