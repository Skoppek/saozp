import { Elysia } from 'elysia';
import {
    ProblemCreationError,
    ProblemNotFoundError,
    ProblemUpdateError,
} from '../errors/problemErrors';

export const problemErrorHandler = new Elysia()
    .error({
        ProblemNotFoundError,
        ProblemUpdateError,
        ProblemCreationError,
    })
    .onError({ as: 'scoped' }, ({ code, error, set }) => {
        switch (code) {
            case 'ProblemNotFoundError':
                set.status = 404;
                return error;
            case 'ProblemCreationError':
            case 'ProblemUpdateError':
                set.status = 500;
                return error;
        }
    });
