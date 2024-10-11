import { Elysia, t } from 'elysia';
import { generalErrorHandler } from './errorHandlers/generalErrorHandler';
import { sessionCleaner } from './plugins/sessionCleaner';
import { corsSettings } from './plugins/corsSettings';
import { initAdmin } from './shared/init';
import { swagger } from '@elysiajs/swagger';
import swaggerConfig from './plugins/swaggerConfig';
import { passwordResetTokenCleaner } from './plugins/passwordResetTokenCleaner';
import profileController from './controller/profileController';
import problemController from './controller/problemController';
import submissionController from './controller/submissionController';
import adminsController from './controller/adminsController';
import groupController from './controller/groupController';
import bundleController from './controller/bundleController';
import authController from './controller/authController';
import contestController from './controller/contestController';
import TestCasesService from './services/TestCasesService';
import cors from '@elysiajs/cors';

const app = new Elysia()
    .use(generalErrorHandler)
    .use(
        cors({
            origin: true,
            credentials: true,
            allowedHeaders: [
                'Authorization',
                'Content-Type',
                'Cookie',
                'Set-Cookie',
                'Access-Control-Allow-Credentials',
            ],
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            preflight: true,
        }),
    )
    .use(swagger(swaggerConfig))
    .use(sessionCleaner)
    .use(passwordResetTokenCleaner)
    .use(authController)
    .use(profileController)
    .use(problemController)
    .use(submissionController)
    .use(adminsController)
    .use(groupController)
    .use(bundleController)
    .use(contestController)
    .post(
        '/tests_validation',
        async ({ body }) =>
            await body.testsFile
                .json()
                .then((val) => TestCasesService.validateTestsFile(val)),
        {
            body: t.Object({
                testsFile: t.File({
                    type: 'application/json',
                }),
            }),
            response: t.Union([
                t.Null(),
                t.Array(
                    t.Object({
                        input: t.Union([t.String(), t.Number(), t.Boolean()]),
                        expected: t.Union([
                            t.String(),
                            t.Number(),
                            t.Boolean(),
                        ]),
                    }),
                ),
            ]),
        },
    );

try {
    await initAdmin();
    app.listen(3000);
    console.log(
        `Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
    );
} catch (error) {
    let message = 'Unknown Error';
    console.error('Error encountered while initializing');
    if (error instanceof Error) message = error.message;
    // we'll proceed, but let's report it
    console.error(message);
}

export type App = typeof app;
