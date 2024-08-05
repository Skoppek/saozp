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

const problemIds = t.Partial(
    t.Object({
        problemIds: t.Array(t.Number()),
        bundleId: t.Number(),
    }),
);

const usersIds = t.Partial(
    t.Object({
        usersIds: t.Array(t.Number()),
        groupId: t.Number(),
    }),
);

export const contestBodies = new Elysia().model({
    createContestBody,
    updateContestBody,
    problemIds,
    usersIds,
});