import { Elysia, Static, t } from 'elysia';
import { mapIfPresent } from '../shared/mapper';
import _ from 'lodash';

const submissionListQuery = t.Object({
    userId: t.Optional(t.String()),
    problemId: t.Optional(t.String()),
    stageId: t.Optional(t.String()),
    commitsOnly: t.Optional(t.String()),
});

export type SubmissionListQuery = Static<typeof submissionListQuery>;

export const parseSubmissionListQuery = (query: SubmissionListQuery) => {
    return {
        userId: mapIfPresent(query.userId, parseInt),
        problemId: mapIfPresent(query.problemId, parseInt),
        stageId: mapIfPresent(query.stageId, parseInt),
        commitsOnly: mapIfPresent(
            query.commitsOnly,
            (value) => value === 'true',
        ),
    };
};

export const submissionQueries = new Elysia().model({
    submissionListQuery,
});
