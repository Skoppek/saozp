import axios from 'axios';

const judge0Url = `${Bun.env.JUDGE0_HOST}:${Bun.env.JUDGE0_PORT}`;

const getAbout = async () => {
    return await axios.get(`${judge0Url}/about`);
};

const submit = async ({
    languageId,
    code,
    test,
    callbackUrl,
}: {
    languageId: number;
    code: string;
    test: {
        input: string;
        expected: string;
    };
    callbackUrl?: string;
}) => {
    const submission = {
        language_id: languageId,
        source_code: code,
        stdin: test.input,
        expected_output: test.expected,
        callback_url: callbackUrl,
    };

    const res = await axios.post(`${judge0Url}/submissions`, {
        ...submission,
    });

    if (!res.data || !('token' in res.data)) {
        throw new Error('Submission failure. Token not received.');
    }

    return new Promise<{ token: string }>((resolve) =>
        resolve(res.data as { token: string }),
    );
};

interface LanguageDetail {
    id: number;
    name: string;
}

const isLanguageDetail = (suspect: any): suspect is LanguageDetail => {
    return 'id' in suspect && 'name' in suspect;
};

const getLanguageById = async (
    id: number,
): Promise<LanguageDetail | undefined> => {
    const body = (await axios.get(`${judge0Url}/languages/${id}`)).data;

    return isLanguageDetail(body)
        ? {
              id: body.id,
              name: body.name,
          }
        : undefined;
};

interface SubmissionResult {
    token: string;
    expected_output: string;
    stdout: string;
    status: {
        id: number;
        description: string;
    };
    time: number;
    memory: number;
}

const fields = [
    'token',
    'expected_output',
    'stdout',
    'status',
    'time',
    'memory',
];

const isSubmissionResult = (suspect: any): suspect is SubmissionResult => {
    return fields.every((field) => field in suspect);
};

const getSubmission = async (
    token: string,
): Promise<SubmissionResult | undefined> => {
    const body = (
        await axios.get(`${judge0Url}/${token}`, {
            params: { fields: fields.join(',') },
        })
    ).data;

    return isSubmissionResult(body) ? body : undefined;
};

export default {
    getAbout,
    getLanguageById,
    submit,
    getSubmission,
};
