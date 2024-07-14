import { Elysia } from 'elysia';
import { GroupCreationError, GroupNotFoundError } from '../errors/groupErrors';
import { HttpStatusCode } from 'elysia-http-status-code';

export const userGroupErrorHandler = new Elysia()
    .error({
        UserGroupCreationError: GroupCreationError,
        UserGroupNotFoundError: GroupNotFoundError,
    })
    .use(HttpStatusCode())
    .onError(({ code, error, set, httpStatus }) => {
        switch (code) {
            case 'UserGroupNotFoundError':
                set.status = httpStatus.HTTP_404_NOT_FOUND;
                return error;
            case 'UserGroupCreationError':
                set.status = httpStatus.HTTP_500_INTERNAL_SERVER_ERROR;
                return error;
        }
    });
