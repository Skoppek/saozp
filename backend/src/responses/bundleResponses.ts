import { Elysia, t } from 'elysia';

const userBasicData = t.Object({
    userId: t.Number(),
    firstName: t.String(),
    lastName: t.String(),
});

const bundleBasicData = t.Object({
    id: t.Number(),
    name: t.String(),
    owner: userBasicData,
});

const getBundleListResponse = t.Array(bundleBasicData);

const getBundleResponse = bundleBasicData;

const getProblemsList = t.Array(
    t.Object({
        id: t.Number(),
        name: t.String(),
        languageId: t.Number(),
    }),
);

export const bundleResponses = new Elysia().model({
    getBundleListResponse,
    getBundleResponse,
    getProblemsList,
});
