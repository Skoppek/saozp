import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import problemController from './controller/problemController';
import submissionController from './controller/submissionController';
import authController from './controller/authController';
import adminsController from './controller/adminsController';
import cors from '@elysiajs/cors';
import profileController from './controller/profileController';
import errorHandling from './controller/errorHandling';
import cron from '@elysiajs/cron';

const app = new Elysia({
    prefix: '/api',
    cookie: {
        secrets: 'The missile knows where it is at all times',
        sign: ['session'],
    },
})
    .use(errorHandling)
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
            methods: ['GET', 'POST', 'DELETE'],
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
    .use(adminsController)
    .listen(3000);

export const server = app.server;

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
