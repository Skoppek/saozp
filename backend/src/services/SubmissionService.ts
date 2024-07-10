import submissionRepository from '../repository/submissionRepository';
import testRepository from '../repository/testRepository';
import judge0Client from '../judge/judge0Client';
import judge0Statuses from '../shared/judge0Statuses';
import {
    parseSubmissionListQuery,
    SubmissionListQuery,
} from '../queryParsers/submissionQueries';

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

    // private static getAverage(array: number[]) {
    //     return array.reduce((avg, element) => avg + element / array.length, 0);
    // }

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
}
