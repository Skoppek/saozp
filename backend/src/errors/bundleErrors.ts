export class BundleCreationFailureError extends Error {
    constructor() {
        super('Bundle creation failure');
    }
}

export class BundleNotFoundError extends Error {
    constructor(bundleId: number) {
        super(`Bundle with id: ${bundleId} not found`);
    }
}
