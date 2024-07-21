import { Elysia } from 'elysia';
import { bundleBodies } from '../bodies/bundleRequests';
import BundleService from '../services/BundleService';
import { authenticatedUser } from '../plugins/authenticatedUser';
import { bundleIdParam } from '../plugins/bundleIdParam';

export default new Elysia({
    prefix: 'bundle',
    detail: {
        tags: ['Bundles'],
    },
})
    .use(authenticatedUser)
    .use(bundleBodies)
    .decorate({
        bundleService: new BundleService(),
    })
    .post(
        '',
        async ({ bundleService, body, user }) =>
            await bundleService.createBundle(body, user.id),
        {
            body: 'createBundleBody',
        },
    )
    .get('', async ({ bundleService }) => await bundleService.getBundleList())
    .group('/:bundleId', (app) =>
        app
            .use(bundleIdParam)
            .get(
                '',
                async ({ bundleService, bundleId }) =>
                    await bundleService.getBundle(bundleId),
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
            .group(
                '/users',
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
    );
