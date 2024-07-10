import { Elysia, t } from 'elysia';
import submissionRepository from '../repository/submissionRepository';
import { SubmissionNotFoundError } from '../errors/submissionErrors';

export const withSubmission = new Elysia()
    .model({
        params: t.Object({
            submissionId: t.Number(),
        }),
    })
    .guard({ params: 'params' })
    .derive({ as: 'scoped' }, async ({ params: { submissionId } }) => {
        const submission =
            await submissionRepository.getSubmissionById(submissionId);
        if (!submission) {
            throw new SubmissionNotFoundError(submissionId);
        }
        return { submission };
    });
