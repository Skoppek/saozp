import { Elysia, t } from 'elysia';

export const bundleIdParam = new Elysia()
    .guard({
        params: t.Object({
            bundleId: t.Number(),
        }),
    })
    .derive({ as: 'scoped' }, ({ params: { bundleId } }) => {
        return { bundleId };
    });
