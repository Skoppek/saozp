import { Elysia, Static, t } from 'elysia';

const createUserGroupBody = t.Object({
    name: t.String(),
});

export type CreateUserGroupBody = Static<typeof createUserGroupBody>;

const userIds = t.Object({
    userIds: t.Array(t.Number()),
});

const updateUserGroupBody = t.Partial(
    t.Object({
        name: t.String(),
        ownerId: t.Number(),
    }),
);

export type UpdateUserGroupBody = Static<typeof updateUserGroupBody>;

export const userGroupBodies = new Elysia().model({
    createUserGroupRequestBody: createUserGroupBody,
    updateUserGroupRequestBody: updateUserGroupBody,
    userIds,
});
