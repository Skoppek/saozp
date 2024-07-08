import userRepository from '../repository/userRepository';

export class AuthService {
    private static getSaltedPassword(password: string) {
        return password + Bun.env.PASSWORD_SALT ?? '';
    }

    static async registerUser(login: string, password: string) {
        const saltedPassword = AuthService.getSaltedPassword(password);
        const hashedPassword = await Bun.password.hash(saltedPassword);

        return await userRepository.createUser({
            login,
            password: hashedPassword,
        });
    }

    async signUp(login: string, password: string) {
        const existingUser = await userRepository.getUserByLogin(login);
        if (existingUser) {
            // throw 409
            throw new Error('User with this email already exists!');
        }

        const newUser = await AuthService.registerUser(login, password);
        if (!newUser) {
            // throw 409
            throw new Error('User creation failure!');
        }

        return newUser;
    }

    async signIn(login: string, password: string) {
        const user = await userRepository.getUserByLogin(login);
        if (!user) {
            // throw 400
            throw new Error('User not found!');
        }

        if (
            !Bun.password.verifySync(
                AuthService.getSaltedPassword(password),
                user.password,
            )
        ) {
            // throw 401
            throw new Error('Unauthenticated');
        }

        return user.id;
    }
}
