import { Elysia, t } from 'elysia';

const basicProfile = t.Object({
    userId: t.Number(),
    firstName: t.String(),
    lastName: t.String(),
});

const profileList = t.Array(basicProfile);

const profileResponse = t.Object({
    userId: t.Number(),
    login: t.String(),
    firstName: t.String(),
    lastName: t.String(),
    isAdmin: t.Optional(t.Boolean()),
});

export const profileResponses = new Elysia().model({
    profileResponse,
    profileList,
});
