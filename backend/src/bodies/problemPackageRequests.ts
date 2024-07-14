import { Elysia, Static, t } from 'elysia';

const createPackageBody = t.Object({
    name: t.String(),
});

export type CreatePackageBody = Static<typeof createPackageBody>;

const problemIds = t.Object({
    problemIds: t.Array(t.Number()),
});

const updatePackageBody = t.Partial(
    t.Object({
        name: t.String(),
        ownerId: t.Number(),
    }),
);

export type UpdatePackageBody = Static<typeof updatePackageBody>;

export const packageBodies = new Elysia().model({
    createPackageBody,
    updatePackageBody,
    problemIds,
});
