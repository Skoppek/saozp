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

const app = new Elysia({
    prefix: '/api',
    cookie: {
        secrets: 'The missile knows where it is at all times',
        sign: ['session'],
    },
})
    .get('/', () => 0)
    .onError(({ code, set }) => {
        if (code === 'NOT_FOUND') {
            set.status = 404;

            return 'Not Found :(';
        }
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
                            'Authentication and autorization endpoints',
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

const initAdmin = async () => {
    const adminCredentials = {
        login: Bun.env.ADMIN_LOGIN as string,
        password: Bun.env.ADMIN_PASSWORD as string,
        firstName: Bun.env.ADMIN_FIRST_NAME as string,
        lastName: Bun.env.ADMIN_LAST_NAME as string,
    };

    if (Object.values(adminCredentials).find((value) => value === undefined)) {
        throw new Error('Admin credentials not complete in env variables!');
    }

    const adminAccount = await userRepository.getUserByLogin(
        adminCredentials.login,
    );

    if (adminAccount) return;

    console.log('Admin user not registered. Creating ...');

    const adminUser = await registerUser(
        adminCredentials.login,
        adminCredentials.password,
    );

    if (!adminUser?.id) {
        throw new Error('Admin creation fail! Aborting.');
    }

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
} catch (error) {}
