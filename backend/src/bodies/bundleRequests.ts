import { Elysia, Static, t } from 'elysia';

const createBundleBody = t.Object({
    name: t.String(),
});

export type CreateBundleBody = Static<typeof createBundleBody>;

const problemIds = t.Object({
    problemIds: t.Array(t.Number()),
});

const updateBundleBody = t.Partial(
    t.Object({
        name: t.String(),
        ownerId: t.Number(),
    }),
);

export type UpdateBundleBody = Static<typeof updateBundleBody>;

export const bundleBodies = new Elysia().model({
    createBundleBody,
    updateBundleBody,
    problemIds,
});
