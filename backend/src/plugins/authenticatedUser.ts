import { Elysia } from 'elysia';
import { sessionCookie } from './sessionCookie';
import userRepository from '../repository/userRepository';
import adminRepository from '../repository/adminRepository';
import { InternalError } from '../errors/generalErrors';

class UserWithSessionNotFoundError extends Error {
    constructor() {
        super('User with valid session not found. Logging out...');
    }
}

export const authenticatedUser = new Elysia()
    .use(sessionCookie)
    .error({
        UserWithSessionNotFoundError,
    })
    .onError(({ code, error, set }) => {
        switch (code) {
            case 'UserWithSessionNotFoundError':
                set.status = 403;
                return error;
        }
    })
    .derive({ as: 'scoped' }, async ({ userId, sessionCookie }) => {
        if (!userId || !sessionCookie) {
            throw new InternalError();
        }
        const user = await userRepository.getUserById(userId);
        if (!user) {
            sessionCookie.remove();
            throw UserWithSessionNotFoundError;
        }

        return {
            user: {
                ...user,
                isAdmin: await adminRepository.isAdmin(user.id),
            },
        };
    });
