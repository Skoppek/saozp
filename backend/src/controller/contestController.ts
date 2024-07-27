import { Elysia } from 'elysia';

export default new Elysia({
    prefix: 'contest',
    detail: {
        tags: ['Contest'],
    },
})
    .post('', ({}) => {})
    .get('', ({}) => {})
    .group('/:contestId', (app) =>
        app
            .get('', ({}) => {})
            .put('', ({}) => {})
            .delete('', ({}) => {})
            .group('/users', (app) =>
                app
                    .get('', ({}) => {})
                    .put('', ({}) => {})
                    .delete('', ({}) => {}),
            )
            .group('/problems', (app) =>
                app
                    .get('', ({}) => {})
                    .put('', ({}) => {})
                    .delete('', ({}) => {}),
            ),
    );
