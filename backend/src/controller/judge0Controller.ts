import { Elysia, t } from 'elysia';
import { NewResult } from '../model/schemas/resultSchema';
import resultRepository from '../repository/resultRepository';

export default new Elysia({ prefix: '/judge0' }).put(
    '/callback',
    ({ body }) => {
        const newResult: NewResult = {
            token: body.token,
            stdout: atob(body.stdout),
            statusId: body.status.id,
            memory: body.memory,
            time: body.time.toString(),
        };

        resultRepository.createResult(newResult);
    },
    {
        detail: {
            tags: ['Judge0'],
        },
        body: t.Object({
            stdout: t.String(),
            time: t.Numeric(),
            memory: t.Number(),
            stderr: t.Nullable(t.String()),
            token: t.String(),
            compile_output: t.Nullable(t.String()),
            message: t.Nullable(t.String()),
            status: t.Object({ id: t.Number(), description: t.String() }),
        }),
    },
);
