import { Elysia, t } from 'elysia';

export const profileResponses = new Elysia().model({
    profileResponse: t.Object({
        userId: t.Number(),
        login: t.String(),
        firstName: t.String(),
        lastName: t.String(),
        isAdmin: t.Optional(t.Boolean()),
    }),
});
