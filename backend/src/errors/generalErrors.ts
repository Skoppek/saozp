export class InternalError extends Error {
    constructor() {
        super('This should not have happened.');
    }
}

export class ResourceWithIdNotFoundError extends Error {
    constructor(resourceName: string, id: number) {
        super(`Resource: ${resourceName} with id: ${id} not found.`);
    }
}

export class NotImplementedError extends Error {
    constructor() {
        super('Feature not ready :(');
    }
}
