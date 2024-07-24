import { Elysia } from 'elysia';
import {
    SubmissionCreationError,
    SubmissionNotFoundError,
} from '../errors/submissionErrors';
import { HttpStatusCode } from 'elysia-http-status-code';

export const submissionErrorHandler = new Elysia()
    .error({
        SubmissionNotFoundError,
        SubmissionCreationError,
    })
    .use(HttpStatusCode())
    .onError({ as: 'global' }, ({ code, error, set, httpStatus }) => {
        switch (code) {
            case 'SubmissionNotFoundError':
                set.status = httpStatus.HTTP_404_NOT_FOUND;
                return error;
            case 'SubmissionCreationError':
                set.status = httpStatus.HTTP_500_INTERNAL_SERVER_ERROR;
                return error;
        }
    });
