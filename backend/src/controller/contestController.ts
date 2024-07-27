import { Elysia } from 'elysia';
import { contestBodies } from '../bodies/contestBodies';
import { authenticatedUser } from '../plugins/authenticatedUser';

export default new Elysia({
    prefix: 'contest',
    detail: {
        tags: ['Contest'],
    },
})
    .use(contestBodies)
    .use(authenticatedUser)
    .post('', ({}) => {}, {
        body: 'createContestBody',
    })
    .get('', ({}) => {})
    .group('/:contestId', (app) =>
        app
            .get('', ({}) => {})
            .put('', ({}) => {}, {
                body: 'updateContestBody',
            })
            .delete('', ({}) => {})
            .group('/users', (app) =>
                app
                    .get('', ({}) => {})
                    .group('', { body: 'usersIds' }, (app) =>
                        app.put('', ({}) => {}).delete('', ({}) => {}),
                    ),
            )
            .group('/problems', (app) =>
                app
                    .get('', ({}) => {})
                    .group('', { body: 'problemIds' }, (app) =>
                        app.put('', ({}) => {}).delete('', ({}) => {}),
                    ),
            ),
    );
