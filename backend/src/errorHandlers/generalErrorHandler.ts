import { Elysia } from 'elysia';
import { InternalError } from '../errors/generalErrors';

export const generalErrorHandler = new Elysia()
    .error({
        InternalError,
    })
    .onError({ as: 'scoped' }, ({ code, error, set }) => {
        switch (code) {
            case 'InternalError':
                set.status = 500;
                return error;
        }
    });
