import axios, { AxiosRequestConfig } from 'axios';

const judge0Url = `http://${process.env.JUDGE_CLIENT_IP}:3002`;

const axiosConfig = {
    proxy: false,
} satisfies AxiosRequestConfig;

const getAbout = async () => {
    return await axios.get(`${judge0Url}/about`, axiosConfig);
};

const submit = async ({
    languageId,
    code,
    test,
}: {
    languageId: number;
    code: string;
    test: {
        input: string;
        expected: string;
    };
}) => {
    const submission = {
        language_id: languageId,
        source_code: code,
        stdin: test.input,
        expected_output: test.expected,
    };

    const res = await axios.post(
        `${judge0Url}/submissions`,
        submission,
        axiosConfig,
    );

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

const isLanguageDetail = (suspect: unknown): suspect is LanguageDetail => {
    return (
        typeof suspect === 'object' &&
        suspect != null &&
        'id' in suspect &&
        'name' in suspect
    );
};

const getLanguageById = async (
    id: number,
): Promise<LanguageDetail | undefined> => {
    const body = (await axios.get(`${judge0Url}/languages/${id}`, axiosConfig))
        .data;

    return isLanguageDetail(body)
        ? {
              id: body.id,
              name: body.name,
          }
        : undefined;
};

interface Status {
    id: number;
    description: string;
}

const isStatus = (suspect: unknown): suspect is Status => {
    return (
        typeof suspect === 'object' &&
        suspect != null &&
        'id' in suspect &&
        typeof suspect.id == 'number' &&
        'description' in suspect &&
        typeof suspect.description == 'string'
    );
};

export interface Submission {
    token: string;
    expected_output: string;
    stdout: string | null;
    stdin: string;
    stderr?: string | null;
    status: Status;
    time: string;
    memory: number;
}

const fields = [
    'token',
    'expected_output',
    'stdout',
    'stdin',
    'stderr',
    'status',
    'time',
    'memory',
];

const isSubmission = (suspect: unknown): suspect is Submission => {
    console.log(suspect);
    
    return (
        typeof suspect === 'object' &&
        suspect != null &&
        'stdin' in suspect &&
        typeof suspect.stdin == 'string' &&
        'expected_output' in suspect &&
        typeof suspect.expected_output == 'string' &&
        'stdout' in suspect &&
        (typeof suspect.stdout == 'string' || suspect.stdout == null) &&
        'time' in suspect &&
        (typeof suspect.time == 'string' || suspect.time === null) &&
        'memory' in suspect &&
        (typeof suspect.memory == 'number' || suspect.memory === null) &&
        'token' in suspect &&
        typeof suspect.token == 'string' &&
        'status' in suspect &&
        isStatus(suspect.status)
    );
};

const isSubmissionArray = (suspect: unknown): suspect is Submission[] => {
    return (
        Array.isArray(suspect) && suspect.every((item) => isSubmission(item))
    );
};

interface SubmissionBatch {
    submissions: Submission[];
}

const isSubmissionBatch = (suspect: unknown): suspect is SubmissionBatch => {
    return (
        typeof suspect === 'object' &&
        suspect != null &&
        'submissions' in suspect &&
        isSubmissionArray(suspect.submissions)
    );
};

const getSubmissionBatch = async (
    tokens: string[],
): Promise<SubmissionBatch> => {
    if (!tokens.length) return { submissions: [] };
    return await axios
        .get(`${judge0Url}/submissions/batch`, {
            ...axiosConfig,
            params: {
                tokens: tokens.join(','),
                fields: fields.join(','),
            },
        })
        .then((response) => {
            if (isSubmissionBatch(response.data)) {
                return response.data;
            } else {
                return {
                    submissions: [
                        {
                            token: '',
                            expected_output: '',
                            stdout: 'Unexpected response',
                            stdin: '',
                            stderr: '',
                            status: {
                                id: 3,
                                description: '',
                            },
                            time: '',
                            memory: 0,
                        },
                    ],
                };
            }
        });
};

export default {
    getAbout,
    getLanguageById,
    submit,
    getSubmissionBatch,
};
