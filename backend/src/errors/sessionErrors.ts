export class SessionNotFoundError extends Error {
    constructor() {
        super('Session not found.');
    }
}

export class SessionCookieNotFoundError extends Error {
    constructor() {
        super('Session cookie not found');
    }
}

export class SessionExpiredError extends Error {
    constructor() {
        super('Session expired');
    }
}
