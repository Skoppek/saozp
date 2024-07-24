import { Elysia } from 'elysia';
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

const app = new Elysia()
    .use(generalErrorHandler)
    .use(corsSettings)
    .use(swagger(swaggerConfig))
    .use(sessionCleaner)
    .use(passwordResetTokenCleaner)
    .use(authController)
    .use(profileController)
    .use(problemController)
    .use(submissionController)
    .use(adminsController)
    .use(groupController)
    .use(bundleController);

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

export type App = typeof app;
