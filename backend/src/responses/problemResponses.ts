import { Elysia, t } from 'elysia';

const problemListResponse = t.Array(
    t.Object({
        problemId: t.Number(),
        name: t.String(),
        languageId: t.Number(),
        creator: t.Object({
            userId: t.Number(),
            firstName: t.String(),
            lastName: t.String(),
        }),
        isContestsOnly: t.Optional(t.Boolean()),
    }),
);

const problemDetailsResponse = t.Object({
    problemId: t.Number(),
    name: t.String(),
    prompt: t.String(),
    languageId: t.Number(),
    baseCode: t.String(),
    creatorId: t.Number(),
    tests: t.Array(
        t.Object({
            input: t.String(),
            expected: t.String(),
        }),
    ),
    isContestsOnly: t.Optional(t.Boolean()),
});

export const problemResponses = new Elysia().model({
    problemListResponse,
    problemDetailsResponse,
});
