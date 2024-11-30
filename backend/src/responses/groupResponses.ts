import { Elysia, t } from 'elysia';

const userBasicData = t.Object({
    userId: t.Number(),
    firstName: t.String(),
    lastName: t.String(),
});

const groupBasicData = t.Object({
    id: t.Number(),
    name: t.String(),
    owner: userBasicData,
});

const getGroupListResponse = t.Array(groupBasicData);

const getGroupResponse = groupBasicData;

const getUsersList = t.Array(
    t.Object({
        userId: t.Number(),
        firstName: t.String(),
        lastName: t.String(),
    }),
);

export const groupResponses = new Elysia().model({
    getGroupListResponse,
    getGroupResponse,
    getUsersList,
});
