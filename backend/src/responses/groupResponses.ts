import { Elysia, t } from 'elysia';

const UserBasicData = t.Object({
    userId: t.Number(),
    firstName: t.String(),
    lastName: t.String(),
});

const groupBasicData = t.Object({
    id: t.Number(),
    name: t.String(),
    owner: UserBasicData,
});

const getGroupListResponse = t.Array(groupBasicData);

const getGroupResponse = t.Intersect([
    groupBasicData,
    t.Object({
        users: t.Array(
            t.Object({
                userId: t.Number(),
                firstName: t.String(),
                lastName: t.String(),
            }),
        ),
    }),
]);

export const groupResponses = new Elysia().model({
    getGroupListResponse,
    getGroupResponse,
});
