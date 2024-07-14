import { Elysia } from 'elysia';

export default new Elysia({
    prefix: 'package',
    detail: {
        tags: ['Packages'],
    },
})
    .post('', ({}) => {}, {
        detail: {
            tags: ['Packages'],
        },
    })
    .get('', ({}) => {});
