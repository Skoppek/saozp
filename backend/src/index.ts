import { Elysia } from 'elysia';
import userRepository from './repository/userRepository';
import profileRepository from './repository/profileRepository';
import adminRepository from './repository/adminRepository';
import { generalErrorHandler } from './errorHandlers/generalErrorHandler';
import { sessionCleaner } from './plugins/sessionCleaner';
import { swaggerDocs } from './plugins/swaggerDocs';
import { corsSettings } from './plugins/corsSettings';
import { AuthService } from './services/AuthService';
import { isSignUpCredentials } from './shared/SignUpCredentials';
import { controller } from './controller/controller';

const app = new Elysia({
    cookie: {
        secrets: 'The missile knows where it is at all times',
        sign: ['session'],
    },
})
    .use(generalErrorHandler)
    .use(corsSettings)
    .use(swaggerDocs)
    .use(sessionCleaner)
    .use(controller);

const initAdmin = async () => {
    const adminCredentials = {
        login: Bun.env.ADMIN_LOGIN,
        password: Bun.env.ADMIN_PASSWORD,
        firstName: Bun.env.ADMIN_FIRST_NAME,
        lastName: Bun.env.ADMIN_LAST_NAME,
    };

    if (!isSignUpCredentials(adminCredentials)) {
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

    const adminUser = await AuthService.registerUser(
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
