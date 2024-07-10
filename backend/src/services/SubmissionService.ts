import submissionRepository from '../repository/submissionRepository';
import testRepository from '../repository/testRepository';
import judge0Client from '../judge/judge0Client';
import judge0Statuses from '../shared/judge0Statuses';
import {
    parseSubmissionListQuery,
    SubmissionListQuery,
} from '../queryParsers/submissionQueries';
import problemRepository from '../repository/problemRepository';
import judge0Service from '../judge/judge0Client';

export class SubmissionService {
    private static reduceToStatus(
        statusIds: number[],
    ): { id: number; description: string } | undefined {
        if (statusIds.includes(1)) {
            return judge0Statuses.inQueue;
        }
        if (statusIds.includes(2)) {
            return judge0Statuses.processing;
        }
        if (statusIds.some((status) => status == 5)) {
            return judge0Statuses.timeLimitExceeded;
        }
        if (statusIds.some((status) => status > 5)) {
            return judge0Statuses.error;
        }
        if (statusIds.every((status) => status == 3)) {
            return judge0Statuses.accepted;
        }
        return judge0Statuses.wrongAnswer;
    }

    private static getAverage(array: number[]) {
        return array.reduce((avg, element) => avg + element / array.length, 0);
    }

    async getSubmissionsList(query: SubmissionListQuery) {
        const { userId, problemId, commitsOnly } =
            parseSubmissionListQuery(query);

        const submissions = await submissionRepository.getSubmissionsList(
            userId,
            problemId,
            commitsOnly,
        );

        return await Promise.all(
            submissions.map(async (submission) => {
                const tests = await testRepository.getTestsOfSubmission(
                    submission.id,
                );
                const results = (
                    await judge0Client.getSubmissionBatch(
                        tests.map((test) => test.token),
                    )
                ).submissions;

                return {
                    submissionId: submission.id,
                    creator: {
                        login: '',
                        userId: submission.creator?.userId ?? -1,
                        firstName: submission.creator?.firstName ?? '',
                        lastName: submission.creator?.lastName ?? '',
                    },
                    createdAt: submission.createdAt?.toLocaleString(),
                    status: SubmissionService.reduceToStatus(
                        results.map((result) => result.status.id),
                    ),
                    isCommit: submission.isCommit,
                };
            }),
        );
    }

    async getSubmissionDetails(submissionId: number) {
        const submission =
            await submissionRepository.getSubmissionById(submissionId);

        if (!submission) {
            throw new Error('Internal error! Submission was not found.');
        }

        const problem = await problemRepository.getProblemById(
            submission.problemId,
        );

        if (!problem) {
            // set.status = 500;
            throw new Error('Internal error! Problem was not found.');
        }

        const tests = await testRepository.getTestsOfSubmission(submissionId);

        const results = (
            await judge0Client.getSubmissionBatch(
                tests.map((test) => test.token),
            )
        ).submissions;

        return {
            languageId:
                (await judge0Service.getLanguageById(problem.languageId))?.id ??
                0,
            code: submission.code,
            result: {
                tests: results.map((result) => {
                    return {
                        statusId: result.status.id,
                        token: result.token,
                        input: result.stdin,
                        expected: result.expected_output,
                        received: result.stdout,
                    };
                }),
                averageMemory: SubmissionService.getAverage(
                    results.map((result) => result.memory),
                ),
                averageTime: SubmissionService.getAverage(
                    results.map((result) => parseFloat(result.time)),
                ),
            },
        };
    }
}
