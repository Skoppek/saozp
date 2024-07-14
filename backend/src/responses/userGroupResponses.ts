import { Elysia, t } from 'elysia';

const userBasicData = t.Object({
    userId: t.Number(),
    firstName: t.String(),
    lastName: t.String(),
});

const userGroupBasicData = t.Object({
    id: t.Number(),
    name: t.String(),
    owner: userBasicData,
});

const getUserGroupListResponse = t.Array(userGroupBasicData);

const getUserGroupResponse = t.Intersect([
    userGroupBasicData,
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

export const userGroupResponses = new Elysia().model({
    getUserGroupListResponse,
    getUserGroupResponse,
});
