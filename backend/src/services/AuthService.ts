import UserRepository from '../repository/UserRepository';
import randomstring from 'randomstring';
import PasswordResetTokenRepository from '../repository/PasswordResetTokenRepository';
import moment from 'moment';
import {
    PasswordMarkedForResetError,
    PasswordResetTokenNotFoundError,
    PasswordResetWrongLoginError,
    UserNotFoundError,
} from '../errors/authErrors';

export default abstract class AuthService {
    private static getSaltedString(password: string) {
        return password + Bun.env.PASSWORD_SALT ?? '';
    }

    private static async getHashedString(value: string) {
        const saltedValue = AuthService.getSaltedString(value);
        return await Bun.password.hash(saltedValue);
    }

    static async registerUser(login: string, password: string) {
        return await UserRepository.createUser({
            login,
            password: await AuthService.getHashedString(password),
        });
    }

    static async signUp(login: string, password: string) {
        const existingUser = await UserRepository.getUserByLogin(login);
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

    static async signIn(login: string, password: string) {
        const user = await UserRepository.getUserByLogin(login);
        if (!user) {
            throw new UserNotFoundError();
        }

        const passwordResetToken =
            await PasswordResetTokenRepository.getTokenForUser(user.id);

        if (
            passwordResetToken &&
            moment(passwordResetToken.expiresAt).isAfter(moment())
        ) {
            throw new PasswordMarkedForResetError();
        }

        if (
            !Bun.password.verifySync(
                AuthService.getSaltedString(password),
                user.password,
            )
        ) {
            // throw 401
            throw new Error('Unauthenticated');
        }

        return user.id;
    }

    static async createPasswordResetToken(userId: number) {
        const token = randomstring.generate({
            length: 4,
            charset: 'alphanumeric',
            capitalization: 'uppercase',
        });

        console.log(token);

        await PasswordResetTokenRepository.putToken({
            userId,
            token: Bun.hash(token).toString(),
            expiresAt: moment().add(1, 'day').toDate(),
        });

        return { token };
    }

    static async resetPassword(
        token: string,
        newPassword: string,
        login: string,
    ) {
        const hash = Bun.hash(token).toString();

        const tokenData =
            await PasswordResetTokenRepository.getTokenByToken(hash);

        const user = await UserRepository.getUserByLogin(login);

        if (user?.id != tokenData?.userId) {
            throw new PasswordResetWrongLoginError();
        }

        if (!tokenData || moment(tokenData.expiresAt).isBefore(moment())) {
            throw new PasswordResetTokenNotFoundError();
        }

        await UserRepository.updateUser(tokenData.userId, {
            password: await AuthService.getHashedString(newPassword),
        });

        await PasswordResetTokenRepository.removeTokenOfUser(tokenData.userId);
    }
}
