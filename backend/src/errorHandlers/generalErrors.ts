export class InternalError extends Error {
    constructor() {
        super('This should not have happened.');
    }
}
