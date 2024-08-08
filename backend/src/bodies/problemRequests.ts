import { Elysia, Static, t } from 'elysia';

const createProblemRequest = t.Object({
    name: t.String(),
    description: t.String(),
    prompt: t.String(),
    languageId: t.Number(),
    baseCode: t.String(),
    tests: t.Array(
        t.Object({
            input: t.String(),
            expected: t.String(),
        }),
    ),
    activeAfter: t.Date(),
});

export type CreateProblemRequest = Static<typeof createProblemRequest>;

const updateProblemRequest = t.Partial(
    t.Object({
        name: t.String(),
        description: t.String(),
        prompt: t.String(),
        languageId: t.Number(),
        baseCode: t.String(),
        testsFile: t.Array(
            t.Object({
                input: t.String(),
                expected: t.String(),
            }),
        ),
        activeAfter: t.Date(),
    }),
);

export type UpdateProblemRequest = Static<typeof updateProblemRequest>;

export const problemRequests = new Elysia().model({
    createProblemRequest,
    updateProblemRequest,
});
