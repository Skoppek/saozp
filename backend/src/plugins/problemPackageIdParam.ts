import { Elysia, t } from 'elysia';

export const problemPackageIdParam = new Elysia()
    .guard({
        params: t.Object({
            packageId: t.Number(),
        }),
    })
    .derive({ as: 'local' }, ({ params: { packageId } }) => {
        return { packageId };
    })
    .propagate();
