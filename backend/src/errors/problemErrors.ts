export class ProblemNotFoundError extends Error {
    constructor(problemId: number) {
        super(`Problem with id = ${problemId} not found.`);
    }
}

export class ProblemUpdateError extends Error {
    constructor(problemId: number) {
        super(`Failed to update a problem with id = ${problemId}.`);
    }
}

export class ProblemCreationError extends Error {
    constructor() {
        super('Failed to create a new problem.');
    }
}
