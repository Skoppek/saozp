import { Elysia, Static, t } from 'elysia';

const createUserGroupRequestBody = t.Object({
    name: t.String(),
});

export type CreateUserGroupRequestBody = Static<
    typeof createUserGroupRequestBody
>;

const userIds = t.Object({
    userIds: t.Array(t.Number()),
});

const updateUserGroupRequestBody = t.Partial(
    t.Object({
        name: t.String(),
        ownerId: t.Number(),
    }),
);

export type UpdateUserGroupRequestBody = Static<
    typeof updateUserGroupRequestBody
>;

export const userGroupRequestBodies = new Elysia().model({
    createUserGroupRequestBody,
    updateUserGroupRequestBody,
    userIds,
});
