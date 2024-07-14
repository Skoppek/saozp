import { Elysia, t } from 'elysia';

const createUserGroupRequestBody = t.Object({
    name: t.String(),
});

const userIds = t.Object({
    userIds: t.Array(t.Number()),
});

const updateUserGroupRequestBody = t.Partial(
    t.Object({
        name: t.String(),
        creatorId: t.Number(),
    }),
);

export const userGroupRequestBodies = new Elysia().model({
    createUserGroupRequestBody,
    updateUserGroupRequestBody,
    userIds,
});
