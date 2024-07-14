import { Elysia } from 'elysia';
import { sessionCookie } from './sessionCookie';
import { InternalError } from '../errors/generalErrors';
import AdminRepository from '../repository/AdminRepository';
import UserRepository from '../repository/UserRepository';

class UserWithSessionNotFoundError extends Error {
    constructor() {
        super('User with valid session not found. Logging out...');
    }
}

export const authenticatedUser = new Elysia()
    .use(sessionCookie)
    .decorate({
        adminRepository: new AdminRepository(),
        userRepository: new UserRepository(),
    })
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
    .derive(
        { as: 'scoped' },
        async ({ adminRepository, userRepository, userId, sessionCookie }) => {
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
                sessionCookie,
            };
        },
    );
