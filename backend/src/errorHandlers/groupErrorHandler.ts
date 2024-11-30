import { Elysia } from 'elysia';
import { GroupCreationError, GroupNotFoundError } from '../errors/groupErrors';
import { HttpStatusCode } from 'elysia-http-status-code';

export const groupErrorHandler = new Elysia()
    .error({
        GroupCreationError,
        GroupNotFoundError,
    })
    .use(HttpStatusCode())
    .onError({ as: 'scoped' }, ({ code, error, set, httpStatus }) => {
        switch (code) {
            case 'GroupNotFoundError':
                set.status = httpStatus.HTTP_404_NOT_FOUND;
                return error;
            case 'GroupCreationError':
                set.status = httpStatus.HTTP_500_INTERNAL_SERVER_ERROR;
                return error;
        }
    });
