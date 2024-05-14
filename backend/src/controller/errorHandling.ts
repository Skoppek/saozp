import Elysia from 'elysia';

export default new Elysia().onError(({ code, set }) => {
    if (code === 'NOT_FOUND') {
        set.status = 404;

        return 'Not Found :(';
    }
});
