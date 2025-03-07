import { Elysia } from 'elysia';
import { GroupCreationError, GroupNotFoundError } from '../errors/groupErrors';

export const groupErrorHandler = new Elysia()
    .error({
        GroupCreationError,
        GroupNotFoundError,
    })
    .onError({ as: 'scoped' }, ({ code, error, set }) => {
        switch (code) {
            case 'GroupNotFoundError':
                set.status = 404;
                return error;
            case 'GroupCreationError':
                set.status = 500;
                return error;
        }
    });
