import { Elysia } from 'elysia';
import { InternalError } from '../errors/generalErrors';
import { HttpStatusCode } from 'elysia-http-status-code';

export const generalErrorHandler = new Elysia()
    .error({
        InternalError,
    })
    .use(HttpStatusCode())
    .onError({ as: 'global' }, ({ code, error, set, httpStatus }) => {
        switch (code) {
            case 'InternalError':
                set.status = httpStatus.HTTP_500_INTERNAL_SERVER_ERROR;
                return error;
            case 'NOT_FOUND':
                return 'Endpoint not found.';
        }
    });
