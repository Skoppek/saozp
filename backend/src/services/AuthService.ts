import UserRepository from '../repository/UserRepository';
import randomstring from 'randomstring';
import PasswordResetTokenRepository from '../repository/PasswordResetTokenRepository';
import moment from 'moment';
import {
    PasswordMarkedForResetError,
    PasswordResetTokenNotFoundError,
    UserNotFoundError,
} from '../errors/authErrors';

export class AuthService {
    private userRepository = new UserRepository();
    private passwordResetTokenRepository = new PasswordResetTokenRepository();

    private static getSaltedPassword(password: string) {
        return password + Bun.env.PASSWORD_SALT ?? '';
    }

    private static async preparePassword(password: string) {
        const saltedPassword = AuthService.getSaltedPassword(password);
        return await Bun.password.hash(saltedPassword);
    }

    async registerUser(login: string, password: string) {
        return await this.userRepository.createUser({
            login,
            password: await AuthService.preparePassword(password),
        });
    }

    async signUp(login: string, password: string) {
        const existingUser = await this.userRepository.getUserByLogin(login);
        if (existingUser) {
            // throw 409
            throw new Error('User with this email already exists!');
        }

        const newUser = await this.registerUser(login, password);
        if (!newUser) {
            // throw 409
            throw new Error('User creation failure!');
        }

        return newUser;
    }

    async signIn(login: string, password: string) {
        const user = await this.userRepository.getUserByLogin(login);
        if (!user) {
            throw new UserNotFoundError();
        }

        const passwordResetToken =
            await this.passwordResetTokenRepository.getTokenForUser(user.id);

        if (
            passwordResetToken &&
            moment(passwordResetToken.expiresAt).isBefore(moment())
        ) {
            throw new PasswordMarkedForResetError();
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

    async createPasswordResetToken(userId: number) {
        const token = randomstring.generate({
            length: 8,
            charset: 'alphanumeric',
            capitalization: 'uppercase',
        });

        await this.passwordResetTokenRepository.putToken({
            userId,
            token,
            expiresAt: moment().add(1, 'day').toDate(),
        });

        return { token };
    }

    async resetPassword(token: string, newPassword: string) {
        const tokenData =
            await this.passwordResetTokenRepository.getTokenByToken(token);

        if (!tokenData || moment(tokenData.expiresAt).isBefore(moment())) {
            throw new PasswordResetTokenNotFoundError();
        }

        await this.userRepository.updateUser(tokenData.userId, {
            password: await AuthService.preparePassword(newPassword),
        });

        await this.passwordResetTokenRepository.removeTokenOfUser(
            tokenData.userId,
        );
    }
}
