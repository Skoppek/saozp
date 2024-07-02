import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import problemController from './controller/problemController';
import submissionController from './controller/submissionController';
import authController, { registerUser } from './controller/authController';
import adminsController from './controller/adminsController';
import cors from '@elysiajs/cors';
import profileController from './controller/profileController';
import userRepository from './repository/userRepository';
import profileRepository from './repository/profileRepository';
import adminRepository from './repository/adminRepository';

const app = new Elysia({
    cookie: {
        secrets: 'The missile knows where it is at all times',
        sign: ['session'],
    },
})
    .use(
        cors({
            origin: true,
            allowedHeaders: [
                'Authorization',
                'Content-Type',
                'Cookie',
                'Set-Cookie',
                'Access-Control-Allow-Credentials',
            ],
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
        }),
    )
    .use(
        // @ts-ignore
        swagger({
            documentation: {
                tags: [
                    {
                        name: 'Auth',
                        description:
                            'Authentication and authorization endpoints',
                    },
                    {
                        name: 'Profiles',
                        description: 'Getting user profile information',
                    },
                    {
                        name: 'Problems',
                        description: 'Problems management',
                    },
                    {
                        name: 'Submissions',
                        description: 'Submissions management',
                    },
                    {
                        name: 'Judge0',
                        description: 'Judge0 feature endpoints',
                    },
                ],
            },
        }),
    )
    .use(authController)
    .use(profileController)
    .use(problemController)
    .use(submissionController)
    .use(adminsController);

export const server = app.server;

interface AdminCredentials {
    login: string;
    password: string;
    firstName: string;
    lastName: string;
}

const isAdminCredentials = (suspect: unknown): suspect is AdminCredentials => {
    return (
        typeof suspect === 'object' &&
        !!suspect &&
        'login' in suspect &&
        typeof suspect.login === 'string' &&
        'password' in suspect &&
        typeof suspect.password === 'string' &&
        'firstName' in suspect &&
        typeof suspect.firstName === 'string' &&
        'lastName' in suspect &&
        typeof suspect.lastName === 'string'
    );
};

const initAdmin = async () => {
    const adminCredentials = {
        login: Bun.env.ADMIN_LOGIN,
        password: Bun.env.ADMIN_PASSWORD,
        firstName: Bun.env.ADMIN_FIRST_NAME,
        lastName: Bun.env.ADMIN_LAST_NAME,
    };

    if (!isAdminCredentials(adminCredentials)) {
        throw new Error(
            'Admin credentials in env variables are not complete. Aborting...',
        );
    }

    const adminAccount = await userRepository.getUserByLogin(
        adminCredentials.login,
    );

    if (
        adminAccount?.id &&
        !(await adminRepository.isAdmin(adminAccount?.id))
    ) {
        throw new Error(
            'Admin credentials in env variables belong to existing user but they are not an admin. Aborting...',
        );
    }

    if (adminAccount) return;

    console.log('Admin user not registered. Creating ...');

    const adminUser = await registerUser(
        adminCredentials.login,
        adminCredentials.password,
    );

    if (!adminUser?.id) {
        throw new Error('Unknown admin creation failure! Aborting...');
    }

    await adminRepository.addToAdmins(adminUser.id);

    await profileRepository.createProfile({
        userId: adminUser.id,
        firstName: adminCredentials.firstName,
        lastName: adminCredentials.lastName,
    });

    console.log(
        `Admin ${adminCredentials.firstName} ${adminCredentials.lastName} created`,
    );
};

try {
    await initAdmin();
    app.listen(3000);
    console.log(
        `Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
    );
} catch (error) {
    let message = 'Unknown Error';
    if (error instanceof Error) message = error.message;
    // we'll proceed, but let's report it
    console.error(message);
}
