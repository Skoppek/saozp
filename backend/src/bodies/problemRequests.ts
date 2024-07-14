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

const updateProblemRequest = t.Object({
    name: t.Optional(t.String()),
    description: t.Optional(t.String()),
    prompt: t.Optional(t.String()),
    languageId: t.Optional(t.Number()),
    baseCode: t.Optional(t.String()),
    tests: t.Optional(
        t.Array(
            t.Object({
                input: t.String(),
                expected: t.String(),
            }),
        ),
    ),
    activeAfter: t.Date(),
});

export type UpdateProblemRequest = Static<typeof updateProblemRequest>;

export const problemRequests = new Elysia().model({
    createProblemRequest,
    updateProblemRequest,
});
