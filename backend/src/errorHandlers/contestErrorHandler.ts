import { Elysia } from 'elysia';
import { HttpStatusCode } from 'elysia-http-status-code';
import {
    ContestCreationError,
    ContestNotFoundError,
    ContestUpdateError,
} from '../errors/contestErrors';

export const contestErrorHandler = new Elysia()
    .error({
        ContestNotFoundError,
        ContestUpdateError,
        ContestCreationError,
    })
    .use(HttpStatusCode())
    .onError({ as: 'scoped' }, ({ code, error, set, httpStatus }) => {
        switch (code) {
            case 'ContestNotFoundError':
                set.status = httpStatus.HTTP_404_NOT_FOUND;
                return error;
            case 'ContestCreationError':
            case 'ContestUpdateError':
                set.status = httpStatus.HTTP_500_INTERNAL_SERVER_ERROR;
                return error;
        }
    });
