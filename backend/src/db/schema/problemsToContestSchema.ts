import { integer } from 'drizzle-orm/pg-core/columns';
import { pgTable } from 'drizzle-orm/pg-core/table';
import { primaryKey } from 'drizzle-orm/pg-core';
import { problemSchema } from './problemSchema';
import { stageSchema } from './stageSchema';

export const problemsToStageSchema = pgTable(
    'problems_to_stage',
    {
        problemId: integer('problem_id')
            .references(() => problemSchema.id)
            .notNull(),
        stageId: integer('stage_id')
            .references(() => stageSchema.id, { onDelete: 'cascade' })
            .notNull(),
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.problemId, table.stageId] }),
        };
    },
);
