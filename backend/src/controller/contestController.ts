import { Elysia } from 'elysia';
import { contestBodies } from '../bodies/contestBodies';
import { authenticatedUser } from '../plugins/authenticatedUser';
import { contestResponses } from '../responses/contestResponses';
import { contestErrorHandler } from '../errorHandlers/contestErrorHandler';
import ContestService from '../services/ContestService';
import idParam from '../plugins/idParam';
import { NotImplementedError } from '../errors/generalErrors';
import { contestQueries } from '../queryParsers/contestQueries';

export default new Elysia({
    prefix: 'contest',
    detail: {
        tags: ['Contest'],
    },
})
    .use(contestErrorHandler)
    .use(contestBodies)
    .use(contestResponses)
    .use(authenticatedUser)
    .use(contestQueries)
    .decorate({
        contestService: new ContestService(),
    })
    .post(
        '',
        async ({ contestService, body, userId }) =>
            await contestService.createContest(body, userId),
        {
            body: 'createContestBody',
        },
    )
    .get(
        '',
        async ({ contestService, query }) =>
            await contestService.getContestList(query),
        {
            response: 'getContestListResponse',
            query: 'submissionListQuery',
        },
    )
    .use(idParam)
    .group(
        '/:id',
        {
            params: 'idParam',
        },
        (app) =>
            app
                .get(
                    '',
                    async ({ contestService, params: { id } }) =>
                        await contestService.getContest(id),
                    {
                        response: 'getContestResponse',
                    },
                )
                .put(
                    '',
                    async ({ contestService, params: { id }, body }) =>
                        await contestService.updateContest(id, body),
                    {
                        body: 'updateContestBody',
                    },
                )
                .delete(
                    '',
                    async ({ contestService, params: { id } }) =>
                        await contestService.deleteContest(id),
                )
                .group('/users', (app) =>
                    app
                        .get(
                            '',
                            async ({ contestService, params: { id } }) =>
                                await contestService.getUsersOfContest(id),
                            {
                                response: 'getContestUsersResponse',
                            },
                        )
                        .group('', { body: 'usersIds' }, (app) =>
                            app
                                .put(
                                    '',
                                    async ({
                                        contestService,
                                        body,
                                        params: { id },
                                    }) => {
                                        if ('groupId' in body)
                                            await contestService.addGroupToContest(
                                                id,
                                                body.groupId,
                                            );
                                        else
                                            await contestService.addUsersToContest(
                                                id,
                                                body.usersIds,
                                            );
                                    },
                                )
                                .delete(
                                    '',
                                    async ({
                                        contestService,
                                        body,
                                        params: { id },
                                    }) => {
                                        if ('groupId' in body)
                                            throw new NotImplementedError();
                                        else
                                            await contestService.removeUsersFromContest(
                                                id,
                                                body.usersIds,
                                            );
                                    },
                                ),
                        ),
                )
                .group('/problems', (app) =>
                    app
                        .get(
                            '',
                            async ({ contestService, params: { id } }) =>
                                await contestService.getProblemsOfContest(id),
                            {
                                response: 'getContestProblemsResponse',
                            },
                        )
                        .group('', { body: 'problemIds' }, (app) =>
                            app
                                .put(
                                    '',
                                    async ({
                                        contestService,
                                        body,
                                        params: { id },
                                    }) => {
                                        if ('problemIds' in body)
                                            await contestService.addProblemsToContest(
                                                id,
                                                body.problemIds,
                                            );
                                        else
                                            await contestService.addBundleToContest(
                                                id,
                                                body.bundleId,
                                            );
                                    },
                                )
                                .delete(
                                    '',
                                    async ({
                                        contestService,
                                        body,
                                        params: { id },
                                    }) => {
                                        if ('bundleId' in body)
                                            throw new NotImplementedError();
                                        else
                                            await contestService.removeProblemsFromContest(
                                                id,
                                                body.problemIds,
                                            );
                                    },
                                ),
                        ),
                ),
    );
