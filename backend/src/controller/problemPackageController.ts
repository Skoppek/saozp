import { Elysia } from 'elysia';
import { NotImplementedError } from '../errors/generalErrors';
import { problemPackageIdParam } from '../plugins/problemPackageIdParam';
import { problemPackageRequestBodies } from '../requests/problemPackageRequests';

export default new Elysia({
    prefix: 'package',
    detail: {
        tags: ['Packages'],
    },
})
    .use(problemPackageRequestBodies)
    .post('', ({}) => {}, {
        detail: {
            tags: ['Packages'],
        },
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
            .put('', async ({}) => {
                throw new NotImplementedError();
            })
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
