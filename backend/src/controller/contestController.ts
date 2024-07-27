import { Elysia } from 'elysia';
import { contestBodies } from '../bodies/contestBodies';
import { authenticatedUser } from '../plugins/authenticatedUser';
import { contestResponses } from '../responses/contestResponses';

export default new Elysia({
    prefix: 'contest',
    detail: {
        tags: ['Contest'],
    },
})
    .use(contestBodies)
    .use(contestResponses)
    .use(authenticatedUser)
    .post('', ({}) => {}, {
        body: 'createContestBody',
    })
    .get('', ({}) => {}, {
        response: 'getContestListResponse',
    })
    .group('/:contestId', (app) =>
        app
            .get('', ({}) => {}, { response: 'getContestResponse' })
            .put('', ({}) => {}, {
                body: 'updateContestBody',
            })
            .delete('', ({}) => {})
            .group('/users', (app) =>
                app
                    .get('', ({}) => {}, {
                        response: 'getContestUsersResponse',
                    })
                    .group('', { body: 'usersIds' }, (app) =>
                        app.put('', ({}) => {}).delete('', ({}) => {}),
                    ),
            )
            .group('/problems', (app) =>
                app
                    .get('', ({}) => {}, {
                        response: 'getContestProblemsResponse',
                    })
                    .group('', { body: 'problemIds' }, (app) =>
                        app.put('', ({}) => {}).delete('', ({}) => {}),
                    ),
            ),
    );
