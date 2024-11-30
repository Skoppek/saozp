import { integer } from 'drizzle-orm/pg-core/columns';
import { pgTable } from 'drizzle-orm/pg-core/table';
import { primaryKey } from 'drizzle-orm/pg-core';
import { problemSchema } from './problemSchema';
import { bundleSchema } from './bundleSchema';

export const problemsToBundleSchema = pgTable(
    'problems_to_bundles',
    {
        problemId: integer('problem_id')
            .references(() => problemSchema.id)
            .notNull(),
        bundleId: integer('bundle_id')
            .references(() => bundleSchema.id, { onDelete: 'cascade' })
            .notNull(),
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.problemId, table.bundleId] }),
        };
    },
);
