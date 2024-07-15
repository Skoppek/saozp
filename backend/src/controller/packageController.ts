import { Elysia } from 'elysia';
import { problemPackageIdParam } from '../plugins/problemPackageIdParam';
import { packageBodies } from '../bodies/problemPackageRequests';
import PackageService from '../services/PackageService';
import { authenticatedUser } from '../plugins/authenticatedUser';

export default new Elysia({
    prefix: 'package',
    detail: {
        tags: ['Packages'],
    },
})
    .use(authenticatedUser)
    .use(packageBodies)
    .decorate({
        packageService: new PackageService(),
    })
    .post(
        '',
        async ({ packageService, body, user }) =>
            await packageService.createPackage(body, user.id),
        {
            body: 'createPackageBody',
        },
    )
    .get(
        '',
        async ({ packageService }) => await packageService.getPackageList(),
    )
    .group(':packageId', (app) =>
        app
            .use(problemPackageIdParam)
            .get(
                '/',
                async ({ packageService, packageId }) =>
                    await packageService.getPackage(packageId),
            )
            .put(
                '',
                async ({ packageService, body, packageId }) =>
                    await packageService.updatePackage(body, packageId),
                {
                    body: 'updatePackageBody',
                },
            )
            .delete(
                '',
                async ({ packageService, packageId }) =>
                    await packageService.deletePackage(packageId),
            )
            .group(
                'users',
                {
                    body: 'problemIds',
                },
                (app) =>
                    app
                        .put(
                            '',
                            async ({
                                packageService,
                                packageId,
                                body: { problemIds },
                            }) =>
                                await packageService.addProblemsToPackage(
                                    packageId,
                                    problemIds,
                                ),
                        )
                        .delete(
                            '',
                            async ({
                                packageService,
                                packageId,
                                body: { problemIds },
                            }) =>
                                await packageService.addProblemsToPackage(
                                    packageId,
                                    problemIds,
                                ),
                        ),
            ),
    );
