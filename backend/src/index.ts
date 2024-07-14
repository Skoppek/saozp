import { Elysia } from 'elysia';
import { generalErrorHandler } from './errorHandlers/generalErrorHandler';
import { sessionCleaner } from './plugins/sessionCleaner';
import { corsSettings } from './plugins/corsSettings';
import { controller } from './controller/controller';
import { initAdmin } from './shared/init';
import { swagger } from '@elysiajs/swagger';
import swaggerConfig from './plugins/swaggerConfig';

const app = new Elysia({
    cookie: {
        secrets: 'The missile knows where it is at all times',
        sign: ['session'],
    },
})
    .use(generalErrorHandler)
    .use(corsSettings)
    .use(swagger(swaggerConfig))
    .use(sessionCleaner)
    .use(controller);

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
