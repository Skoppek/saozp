export class GroupCreationError extends Error {
    constructor() {
        super('Group creation failed.');
    }
}

export class GroupNotFoundError extends Error {
    constructor(groupId: number) {
        super(`Group with id: ${groupId} not found.`);
    }
}
