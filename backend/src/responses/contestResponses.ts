import { Elysia, t } from 'elysia';

const userBasicData = t.Object({
    userId: t.Number(),
    firstName: t.String(),
    lastName: t.String(),
});

const problemBasicData = t.Object({
    problemId: t.Number(),
    name: t.String(),
    languageId: t.Number(),
    creator: userBasicData,
});

const contestBasicData = t.Object({
    id: t.Number(),
    name: t.String(),
    owner: userBasicData,
});

const getContestListResponse = t.Array(contestBasicData);

const getContestResponse = t.Intersect([
    contestBasicData,
    t.Object({
        description: t.String(),
        stages: t.Array(t.Number()),
    }),
]);

const getContestUsersResponse = t.Array(userBasicData);
const getContestProblemsResponse = t.Array(problemBasicData);

export const contestResponses = new Elysia().model({
    getContestListResponse,
    getContestResponse,
    getContestProblemsResponse,
    getContestUsersResponse,
});
