import { Elysia, t } from 'elysia';

export const bundleIdParam = new Elysia()
    .guard({
        params: t.Object({
            bundleId: t.Number(),
        }),
    })
    .derive({ as: 'local' }, ({ params: { bundleId } }) => {
        return { bundleId };
    })
    .propagate();
