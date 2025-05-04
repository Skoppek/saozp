import { Elysia } from 'elysia';
import { generalErrorHandler } from './errorHandlers/generalErrorHandler';
import { sessionCleaner } from './plugins/sessionCleaner';
import { initAdmin } from './shared/init';
import { passwordResetTokenCleaner } from './plugins/passwordResetTokenCleaner';
import profileController from './controller/profileController';
import problemController from './controller/problemController';
import submissionController from './controller/submissionController';
import adminsController from './controller/adminsController';
import groupController from './controller/groupController';
import bundleController from './controller/bundleController';
import authController from './controller/authController';
import contestController from './controller/contestController';
import testCasesController from './controller/testCasesController';
import cors from '@elysiajs/cors';
import { TestQueue } from './shared/testQueue';
import judge0Client from './judge/judge0Client';

const app = new Elysia()
    .use(cors({
        origin: ['localhost']
    }))    
    .get('', () => {
        return 'This is a valid response from SAOZP backend service!';
    })
    .use(generalErrorHandler)
    .use(sessionCleaner)
    .use(passwordResetTokenCleaner)
    .use(testCasesController)
    .use(authController)
    .use(profileController)
    .use(problemController)
    .use(submissionController)
    .use(adminsController)
    .use(groupController)
    .use(bundleController)
    .use(contestController)

try {
    await initAdmin();
    TestQueue.run();
    app.listen(3000);
    console.log(
        `Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
    );
    console.log(await judge0Client.getAbout())
} catch (error) {
    let message = 'Unknown Error';
    console.error('Error encountered while initializing');
    if (error instanceof Error) message = error.message;
    // we'll proceed, but let's report it
    console.error(message);
}

export type App = typeof app;
