import { Elysia } from 'elysia';
import {
    ContestCreationError,
    ContestNotFoundError,
    ContestUpdateError,
} from '../errors/contestErrors';

export const contestErrorHandler = new Elysia()
    .error({
        ContestNotFoundError,
        ContestUpdateError,
        ContestCreationError,
    })
    .onError({ as: 'scoped' }, ({ code, error, set }) => {
        switch (code) {
            case 'ContestNotFoundError':
                set.status = 404;
                return error;
            case 'ContestCreationError':
            case 'ContestUpdateError':
                set.status = 500;
                return error;
        }
    });
