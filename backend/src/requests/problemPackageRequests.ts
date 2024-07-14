import { Elysia, Static, t } from 'elysia';

const createProblemPackageRequestBody = t.Object({
    name: t.String(),
});

export type CreateProblemPackageRequestBody = Static<
    typeof createProblemPackageRequestBody
>;

const problemIds = t.Object({
    problemIds: t.Array(t.Number()),
});

const updateProblemPackageRequestBody = t.Partial(
    t.Object({
        name: t.String(),
        ownerId: t.Number(),
    }),
);

export type UpdateProblemPackageRequestBody = Static<
    typeof updateProblemPackageRequestBody
>;

export const problemPackageRequestBodies = new Elysia().model({
    createProblemPackageRequestBody,
    updateProblemPackageRequestBody,
    problemIds,
});
