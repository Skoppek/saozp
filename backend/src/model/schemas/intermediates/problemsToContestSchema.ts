import { integer } from 'drizzle-orm/pg-core/columns';
import { pgTable } from 'drizzle-orm/pg-core/table';
import { problemSchema } from '../problemSchema';
import { contestSchema } from '../contestSchema';

export const problemsToContestSchema = pgTable('problems_to_contests', {
    problemId: integer('problem_id')
        .references(() => problemSchema.id)
        .notNull(),
    contestId: integer('contest_id')
        .references(() => contestSchema.id, { onDelete: 'cascade' })
        .notNull(),
});
