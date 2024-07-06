import { Elysia, t } from 'elysia';

export const sessionCookieDto = new Elysia().model({
    sessionCookieDto: t.Cookie({
        session: t.String(),
    }),
});
