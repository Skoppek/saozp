import { Elysia } from 'elysia';
import { NotImplementedError } from '../errors/generalErrors';
import { problemPackageIdParam } from '../plugins/problemPackageIdParam';
import { packageBodies } from '../bodies/problemPackageRequests';

export default new Elysia({
    prefix: 'package',
    detail: {
        tags: ['Packages'],
    },
})
    .use(packageBodies)
    .post('', ({}) => {}, {
        body: 'createPackageBody',
    })
    .get('', ({}) => {
        throw new NotImplementedError();
    })
    .group(':packageId', (app) =>
        app
            .use(problemPackageIdParam)
            .get('/', ({}) => {
                throw new NotImplementedError();
            })
            .put(
                '',
                async ({}) => {
                    throw new NotImplementedError();
                },
                {
                    body: 'updatePackageBody',
                },
            )
            .delete('', async ({}) => {
                throw new NotImplementedError();
            })
            .group(
                'users',
                {
                    body: 'problemIds',
                },
                (app) =>
                    app
                        .put('', async ({}) => {
                            throw new NotImplementedError();
                        })
                        .delete('', async ({}) => {
                            throw new NotImplementedError();
                        }),
            ),
    );
