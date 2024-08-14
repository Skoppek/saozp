import { Elysia, Static, t } from 'elysia';
import { mapIfPresent } from '../shared/mapper';

const contestListQuery = t.Object({
    participantId: t.Optional(t.String()),
    ownerId: t.Optional(t.String()),
});

export type ContestListQuery = Static<typeof contestListQuery>;

export const parseContestListQuery = (query: ContestListQuery) => {
    return {
        participantId: mapIfPresent(query.participantId, parseInt),
        ownerId: mapIfPresent(query.ownerId, parseInt),
    };
};

export const contestQueries = new Elysia().model({
    contestListQuery,
});
