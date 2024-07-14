import { Elysia } from 'elysia';
import {
    UserGroupCreationError,
    UserGroupNotFoundError,
} from '../errors/userGroupErrors';

export const userGroupErrorHandler = new Elysia()
    .error({
        UserGroupCreationError,
        UserGroupNotFoundError,
    })
    .onError(({ code, error, set }) => {
        switch (code) {
            case 'UserGroupNotFoundError':
                set.status = 404;
                return error;
            case 'UserGroupCreationError':
                set.status = 500;
                return error;
        }
    });
