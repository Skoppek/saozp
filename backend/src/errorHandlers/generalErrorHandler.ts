import { Elysia } from 'elysia';
import {
    InternalError,
    ResourceWithIdNotFoundError,
} from '../errors/generalErrors';
import { HttpStatusCode } from 'elysia-http-status-code';

export const generalErrorHandler = new Elysia()
    .error({
        InternalError,
        ResourceWithIdNotFoundError,
    })
    .use(HttpStatusCode())
    .onError({ as: 'global' }, ({ code, error, set, httpStatus, request }) => {
        switch (code) {
            case 'InternalError':
                set.status = httpStatus.HTTP_500_INTERNAL_SERVER_ERROR;
                return error;
            case 'ResourceWithIdNotFoundError':
                set.status = httpStatus.HTTP_404_NOT_FOUND;
                return error;
            case 'NOT_FOUND':
                return `Endpoint not found. ${request.url}`;
        }
    });
