export class PackageCreationFailureError extends Error {
    constructor() {
        super('Package creation failure');
    }
}

export class PackageNotFoundError extends Error {
    constructor(packageId: number) {
        super(`Package with id: ${packageId} not found`);
    }
}
