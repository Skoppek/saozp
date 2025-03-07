import { Elysia } from 'elysia';
import {
    InternalError,
    ResourceWithIdNotFoundError,
} from '../errors/generalErrors';

export const generalErrorHandler = new Elysia()
    .error({
        InternalError,
        ResourceWithIdNotFoundError,
    })
    .onError({ as: 'global' }, ({ code, error, set, request }) => {
        switch (code) {
            case 'InternalError':
                set.status = 500;
                return error;
            case 'ResourceWithIdNotFoundError':
                set.status = 404;
                return error;
            case 'NOT_FOUND':
                return `Endpoint not found. ${request.url}`;
        }
    });
