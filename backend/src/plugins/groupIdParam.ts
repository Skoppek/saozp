import { Elysia, t } from 'elysia';

export const groupIdParam = new Elysia()
    .guard({
        params: t.Object({
            groupId: t.Number(),
        }),
    })
    .derive({ as: 'global' }, ({ params: { groupId } }) => {
        return { groupId };
    });
