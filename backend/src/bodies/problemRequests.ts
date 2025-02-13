import { Elysia, Static, t } from 'elysia';

const createProblemRequest = t.Object({
    name: t.String(),
    prompt: t.String(),
    languageId: t.Number(),
    baseCode: t.String(),
    tests: t.Array(
        t.Object({
            input: t.String(),
            expected: t.String(),
        }),
    ),
    isContestsOnly: t.Boolean(),
});

export type CreateProblemRequest = Static<typeof createProblemRequest>;

const updateProblemRequest = t.Partial(createProblemRequest);

export type UpdateProblemRequest = Static<typeof updateProblemRequest>;

export const problemRequests = new Elysia().model({
    createProblemRequest,
    updateProblemRequest,
});
