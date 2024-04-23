import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import problemController from './controller/problemController';
import submissionController from './controller/submissionController';
import judge0Controller from './controller/judge0Controller';
import authController from './controller/authController';
import adminsController from './controller/adminsController';
import cors from '@elysiajs/cors';

const app = new Elysia()
    .use(
        cors({
            origin: true,
            allowedHeaders: [
                'Authorization',
                'Content-Type',
                'Cookie',
                'Set-Cookie',
            ],
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
    // .onBeforeHandle(({ set }) => {
    //     set.headers['content-type'] = 'application/json';
    // })
    .use(judge0Controller)
    .use(authController)
    .use(problemController)
    .use(submissionController)
    .use(adminsController)
    .get('/healthcheck', () => 'Healthcheck!')
    .listen(3000);

export const server = app.server;

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
