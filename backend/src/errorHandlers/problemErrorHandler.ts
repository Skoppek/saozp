import { Elysia } from 'elysia';
import {
    ProblemCreationError,
    ProblemNotFoundError,
    ProblemUpdateError,
} from '../errors/problemErrors';
import { HttpStatusCode } from 'elysia-http-status-code';

export const problemErrorHandler = new Elysia()
    .error({
        ProblemNotFoundError,
        ProblemUpdateError,
        ProblemCreationError,
    })
    .use(HttpStatusCode())
    .onError({ as: 'global' }, ({ code, error, set, httpStatus }) => {
        switch (code) {
            case 'ProblemNotFoundError':
                set.status = httpStatus.HTTP_404_NOT_FOUND;
                return error;
            case 'ProblemCreationError':
            case 'ProblemUpdateError':
                set.status = httpStatus.HTTP_500_INTERNAL_SERVER_ERROR;
                return error;
        }
    });
