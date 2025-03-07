import { Elysia } from 'elysia';
import { ProfileNotFoundError } from '../errors/profileErrors';

export const profileErrorHandler = new Elysia()
    .error({
        ProfileNotFoundError,
    })
    .onError({ as: 'scoped' }, ({ code, error, set }) => {
        switch (code) {
            case 'ProfileNotFoundError':
                set.status = 404;
                return error;
        }
    });
