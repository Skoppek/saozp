import { Elysia, t } from 'elysia';

export const problemResponses = new Elysia().model({
    problemListResponse: t.Array(
        t.Object({
            problemId: t.Number(),
            name: t.String(),
            description: t.String(),
            languageId: t.Number(),
            creator: t.Optional(
                t.Object({
                    userId: t.Number(),
                    login: t.String(),
                    firstName: t.String(),
                    lastName: t.String(),
                }),
            ),
            activeAfter: t.Date(),
        }),
    ),
    problemDetailsResponse: t.Object({
        problemId: t.Number(),
        name: t.String(),
        description: t.String(),
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
        activeAfter: t.Date(),
    })
});
