export class SubmissionNotFoundError extends Error {
    constructor(submissionId: number) {
        super(`Submission with ${submissionId} not found.`);
    }
}
