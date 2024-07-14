export class UserGroupCreationError extends Error {
    constructor() {
        super('User Group creation failed.');
    }
}

export class UserGroupNotFoundError extends Error {
    constructor(groupId: number) {
        super(`User Group with id: ${groupId} not found.`);
    }
}
