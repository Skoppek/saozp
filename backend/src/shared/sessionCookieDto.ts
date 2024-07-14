import { Elysia, t } from 'elysia';

export default new Elysia().model({
    sessionCookieDto: t.Cookie({
        session: t.String(),
    }),
});
