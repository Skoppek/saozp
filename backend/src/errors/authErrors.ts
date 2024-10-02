export class UserNotFoundError extends Error {
    constructor() {
        super(`User has not been found.`);
    }
}

export class PasswordMarkedForResetError extends Error {
    constructor() {
        super('The password has been marked for a reset.');
    }
}

export class PasswordResetTokenNotFoundError extends Error {
    constructor() {
        super('Provided reset token not found.');
    }
}

export class PasswordResetWrongLoginError extends Error {
    constructor() {
        super('Provided login is wrong.');
    }
}
