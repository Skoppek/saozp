import { Elysia, t } from 'elysia';
import { contestBodies } from '../bodies/contestBodies';
import { authenticatedUser } from '../plugins/authenticatedUser';
import { contestResponses } from '../responses/contestResponses';
import { contestErrorHandler } from '../errorHandlers/contestErrorHandler';
import ContestService from '../services/ContestService';
import { NotImplementedError } from '../errors/generalErrors';
import { contestQueries } from '../queryParsers/contestQueries';
import StageService from '../services/StageService';

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
    .post(
        '',
        async ({ body, userId }) => await ContestService.create(body, userId),
        {
            body: 'createContestBody',
        },
    )
    .get('', async ({ query }) => await ContestService.getMany(query), {
        response: 'getContestListResponse',
        query: 'contestListQuery',
    })
    .group(
        '/:contestId',
        {
            params: t.Object({
                contestId: t.Number(),
            }),
        },
        (app) =>
            app
                .resolve(({ params: { contestId } }) => {
                    return {
                        contestService: new ContestService(contestId),
                    };
                })
                .get(
                    '',
                    async ({ contestService }) =>
                        await contestService.getDetails(),
                    {
                        response: 'getContestResponse',
                    },
                )
                .put(
                    '',
                    async ({ contestService, body }) =>
                        await contestService.update(body),
                    {
                        body: 'updateContestBody',
                    },
                )
                .delete(
                    '',
                    async ({ contestService }) => await contestService.delete(),
                )
                .post(
                    '/rerun',
                    async ({ contestService }) =>
                        await contestService.rerunLatestSubmissions(),
                )
                .group('/users', (app) =>
                    app
                        .get(
                            '',
                            async ({ contestService }) =>
                                await contestService.getParticipants(),
                            {
                                response: 'getContestUsersResponse',
                            },
                        )
                        .group('', { body: 'usersIds' }, (app) =>
                            app
                                .put('', async ({ contestService, body }) => {
                                    if (body.groupId)
                                        await contestService.addGroup(
                                            body.groupId,
                                        );
                                    if (body.usersIds)
                                        await contestService.addParticipants(
                                            body.usersIds,
                                        );
                                })
                                .delete(
                                    '',
                                    async ({ contestService, body }) => {
                                        if (body.groupId)
                                            throw new NotImplementedError();
                                        if (body.usersIds)
                                            await contestService.removeParticipants(
                                                body.usersIds,
                                            );
                                    },
                                ),
                        ),
                )
                .group('/stages', (app) =>
                    app
                        .post(
                            '',
                            async ({ contestService, body }) =>
                                await StageService.createStage({
                                    ...body,
                                    contestId: contestService.getContestId(),
                                }),
                            {
                                body: t.Object({
                                    name: t.String(),
                                    startDate: t.Date(),
                                    endDate: t.Date(),
                                }),
                            },
                        )
                        .group(
                            '/:stageId',
                            {
                                params: t.Object({
                                    stageId: t.Number(),
                                }),
                            },
                            (app) =>
                                app
                                    .resolve(({ params: { stageId } }) => {
                                        return {
                                            stageService: new StageService(
                                                stageId,
                                            ),
                                        };
                                    })
                                    .get(
                                        '',
                                        async ({ stageService }) =>
                                            await stageService.getDetails(),
                                        {
                                            response: t.Object({
                                                name: t.String(),
                                                startDate: t.Date(),
                                                endDate: t.Date(),
                                                problems: t.Array(
                                                    t.Object({
                                                        problemId: t.Number(),
                                                        name: t.String(),
                                                        languageId: t.Number(),
                                                    }),
                                                ),
                                            }),
                                        },
                                    )
                                    .put(
                                        '',
                                        async ({ stageService, body }) =>
                                            await stageService.update(body),
                                        {
                                            body: t.Partial(
                                                t.Object({
                                                    name: t.String(),
                                                    startDate: t.Date(),
                                                    endDate: t.Date(),
                                                }),
                                            ),
                                        },
                                    )
                                    .group(
                                        '',
                                        { body: t.Array(t.Number()) },
                                        (app) =>
                                            app
                                                .put(
                                                    '/problems',
                                                    async ({
                                                        stageService,
                                                        body,
                                                    }) =>
                                                        await stageService.addProblems(
                                                            body,
                                                        ),
                                                )
                                                .delete(
                                                    '/problems',
                                                    async ({
                                                        stageService,
                                                        body,
                                                    }) =>
                                                        await stageService.removeProblems(
                                                            body,
                                                        ),
                                                )
                                                .put(
                                                    '/bundle',
                                                    async ({
                                                        stageService,
                                                        body,
                                                    }) =>
                                                        await stageService.addBundle(
                                                            body,
                                                        ),
                                                    {
                                                        body: t.Number(),
                                                    },
                                                ),
                                    )
                                    .delete(
                                        '',
                                        async ({ stageService }) =>
                                            await stageService.delete(),
                                    ),
                        ),
                ),
    );
