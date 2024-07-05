import { Elysia } from 'elysia';
import { InternalError } from './generalErrors';

export const generalErrorHandler = new Elysia()
    .error({
        InternalError,
    })
    .onError(({ code, error, set }) => {
        switch (code) {
            case 'InternalError':
                set.status = 500;
                return error;
        }
    });
