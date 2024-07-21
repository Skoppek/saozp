import { Elysia } from 'elysia';
import { ProfileNotFoundError } from '../errors/profileErrors';
import { HttpStatusCode } from 'elysia-http-status-code';

export const profileErrorHandler = new Elysia()
    .error({
        ProfileNotFoundError,
    })
    .use(HttpStatusCode())
    .onError({ as: 'global' }, ({ code, error, set, httpStatus }) => {
        switch (code) {
            case 'ProfileNotFoundError':
                set.status = httpStatus.HTTP_404_NOT_FOUND;
                return error;
        }
    });
