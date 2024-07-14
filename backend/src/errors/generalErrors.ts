export class InternalError extends Error {
    constructor() {
        super('This should not have happened.');
    }
}

export class NotImplementedError extends Error {
    constructor() {
        super('Feature not ready :(');
    }
}
