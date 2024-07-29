export class ContestNotFoundError extends Error {
    constructor(contestId: number) {
        super(`Contest with id = ${contestId} not found.`);
    }
}

export class ContestUpdateError extends Error {
    constructor(problemId: number) {
        super(`Failed to update a contest with id = ${problemId}.`);
    }
}

export class ContestCreationError extends Error {
    constructor() {
        super('Failed to create a new contest.');
    }
}
