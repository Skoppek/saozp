import { Elysia, Static, t } from 'elysia';

const createContestBody = t.Object({
    name: t.String(),
    description: t.String(),
    startDate: t.Date(),
    endDate: t.Date(),
});

export type CreateContestBody = Static<typeof createContestBody>;

const updateContestBody = t.Partial(
    t.Object({
        name: t.String(),
        description: t.String(),
        startDate: t.Date(),
        endDate: t.Date(),
        ownerId: t.Number(),
    }),
);

export type UpdateContestBody = Static<typeof updateContestBody>;

const problemIds = t.Union([
    t.Object({
        problemIds: t.Array(t.Number()),
    }),
    t.Object({
        bundleIds: t.Array(t.Number()),
    }),
]);

const usersIds = t.Union([
    t.Object({
        usersIds: t.Array(t.Number()),
    }),
    t.Object({
        groupIds: t.Array(t.Number()),
    }),
]);

export const contestBodies = new Elysia().model({
    createContestBody,
    updateContestBody,
    problemIds,
    usersIds,
});
