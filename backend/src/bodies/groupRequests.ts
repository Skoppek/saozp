import { Elysia, Static, t } from 'elysia';

const createGroupBody = t.Object({
    name: t.String(),
});

export type CreateGroupBody = Static<typeof createGroupBody>;

const userIds = t.Object({
    userIds: t.Array(t.Number()),
});

const updateGroupBody = t.Partial(
    t.Object({
        name: t.String(),
        ownerId: t.Number(),
    }),
);

export type UpdateGroupBody = Static<typeof updateGroupBody>;

export const groupBodies = new Elysia().model({
    createGroupBody,
    updateGroupBody,
    userIds,
});
