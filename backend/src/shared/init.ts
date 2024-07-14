import { isSignUpCredentials } from './SignUpCredentials';
import userRepository from '../repository/userRepository';
import adminRepository from '../repository/AdminRepository';
import { AuthService } from '../services/AuthService';
import { ProfileService } from '../services/ProfileService';

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

    const authService = new AuthService();

    const user = await authService.signUp(
        adminCredentials.login,
        adminCredentials.password,
    );

    await adminRepository.addToAdmins(user.id);

    const profileService = new ProfileService();

    await profileService.createProfile(
        user.id,
        adminCredentials.firstName,
        adminCredentials.lastName,
    );

    console.log(
        `User ${adminCredentials.firstName} ${adminCredentials.lastName} created and added to admins list.`,
    );
};
