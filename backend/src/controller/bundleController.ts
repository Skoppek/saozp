import { Elysia } from 'elysia';
import { bundleBodies } from '../bodies/bundleRequests';
import BundleService from '../services/BundleService';
import { authenticatedUser } from '../plugins/authenticatedUser';
import { bundleIdParam } from '../plugins/bundleIdParam';
import { bundleResponses } from '../responses/bundleResponses';

export default new Elysia({
    prefix: 'bundle',
    detail: {
        tags: ['Bundles'],
    },
})
    .use(bundleBodies)
    .use(bundleResponses)
    .decorate({
        bundleService: new BundleService(),
    })
    .use(authenticatedUser)
    .post(
        '',
        async ({ bundleService, body, user }) =>
            await bundleService.createBundle(body, user.id),
        {
            body: 'createBundleBody',
        },
    )
    .get('', async ({ bundleService }) => await bundleService.getBundleList(), {
        response: 'getBundleListResponse',
    })
    .group('/:bundleId', (app) =>
        app
            .use(bundleIdParam)
            .get(
                '',
                async ({ bundleService, bundleId }) =>
                    await bundleService.getBundle(bundleId),
                {
                    response: 'getBundleResponse',
                },
            )
            .put(
                '',
                async ({ bundleService, body, bundleId }) =>
                    await bundleService.updateBundle(body, bundleId),
                {
                    body: 'updateBundleBody',
                },
            )
            .delete(
                '',
                async ({ bundleService, bundleId }) =>
                    await bundleService.deleteBundle(bundleId),
            )
            .group('/problems', (app) =>
                app
                    .get(
                        '',
                        async ({ bundleService, bundleId }) =>
                            await bundleService.getProblemsOfBundle(bundleId),
                        {
                            response: 'getProblemsList',
                        },
                    )
                    .group(
                        '',
                        {
                            body: 'problemIds',
                        },
                        (app) =>
                            app

                                .put(
                                    '',
                                    async ({
                                        bundleService,
                                        bundleId,
                                        body: { problemIds },
                                    }) =>
                                        await bundleService.addProblemsToBundle(
                                            bundleId,
                                            problemIds,
                                        ),
                                )
                                .delete(
                                    '',
                                    async ({
                                        bundleService,
                                        bundleId,
                                        body: { problemIds },
                                    }) =>
                                        await bundleService.removeProblemsFromBundle(
                                            bundleId,
                                            problemIds,
                                        ),
                                ),
                    ),
            ),
    );
