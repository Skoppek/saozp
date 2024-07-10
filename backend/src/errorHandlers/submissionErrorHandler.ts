import { Elysia } from 'elysia';
import { SubmissionNotFoundError } from '../errors/submissionErrors';

export const submissionErrorHandler = new Elysia()
    .error({
        SubmissionNotFoundError,
    })
    .onError(({ code, error, set }) => {
        switch (code) {
            case 'SubmissionNotFoundError':
                set.status = 404;
                return error;
        }
    });
