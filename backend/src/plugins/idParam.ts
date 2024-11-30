import { Elysia, t } from 'elysia';

export default new Elysia().model({
    idParam: t.Object({
        id: t.Number(),
    }),
});
