import { Elysia } from 'elysia';
import { UserGroupCreationError } from '../errors/userGroupErrors';

export const userGroupErrorHandler = new Elysia()
    .error({
        UserGroupCreationError,
    })
    .onError(({ code, error, set }) => {
        switch (code) {
            case 'UserGroupCreationError':
                set.status = 500;
                return error;
        }
    });
