import { isSignUpCredentials } from './SignUpCredentials';
import { ProfileService } from '../services/ProfileService';
import UserRepository from '../repository/UserRepository';
import AdminRepository from '../repository/AdminRepository';
import AuthService from '../services/AuthService';

export const initAdmin = async () => {
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

    const adminAccount = await UserRepository.getUserByLogin(
        adminCredentials.login,
    );

    if (
        adminAccount?.id &&
        !(await AdminRepository.isAdmin(adminAccount?.id))
    ) {
        throw new Error(
            'Admin credentials in env variables belong to existing user but they are not an admin. Aborting...',
        );
    }

    if (adminAccount) return;

    console.log('Admin user not registered. Creating ...');

    const user = await AuthService.signUp(
        adminCredentials.login,
        adminCredentials.password,
    );

    await AdminRepository.addToAdmins(user.id);

    await ProfileService.createProfile(
        user.id,
        adminCredentials.firstName,
        adminCredentials.lastName,
    );

    console.log(
        `User ${adminCredentials.firstName} ${adminCredentials.lastName} created and added to admins list.`,
    );
};
