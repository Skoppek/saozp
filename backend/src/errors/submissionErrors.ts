export class SubmissionNotFoundError extends Error {
    constructor(submissionId: number) {
        super(`Submission with ${submissionId} not found.`);
    }
}

export class SubmissionCreationError extends Error {
    constructor() {
        super('Failed to create a new submission.');
    }
}
