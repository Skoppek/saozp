import { Elysia } from 'elysia';
import {
    SubmissionCreationError,
    SubmissionNotFoundError,
} from '../errors/submissionErrors';

export const submissionErrorHandler = new Elysia()
    .error({
        SubmissionNotFoundError,
        SubmissionCreationError,
    })
    .onError(({ code, error, set }) => {
        switch (code) {
            case 'SubmissionNotFoundError':
                set.status = 404;
                return error;
            case 'SubmissionCreationError':
                set.status = 500;
                return error;
        }
    });
