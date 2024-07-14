import { Elysia, t } from 'elysia';

export const userGroupIdParam = new Elysia()
    .guard({
        params: t.Object({
            groupId: t.Number(),
        }),
    })
    .derive({ as: 'local' }, ({ params: { groupId } }) => {
        return { groupId };
    })
    .propagate();
