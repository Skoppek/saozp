import { Elysia } from 'elysia';
import { authenticatedUser } from './authenticatedUser';

class UnauthorizedError extends Error {
    constructor() {
        super('Unauthorized');
    }
}

export const adminUserAccess = new Elysia()
    .use(authenticatedUser)
    .error({
        UnauthorizedError,
    })
    .onError(({ code, error, set }) => {
        switch (code) {
            case 'UnauthorizedError':
                set.status = 403;
                return error;
        }
    })
    .onBeforeHandle({ as: 'local' }, ({ user }) => {
        if (!user.isAdmin) {
            throw new UnauthorizedError();
        }
    });