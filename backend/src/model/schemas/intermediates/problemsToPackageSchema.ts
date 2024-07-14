import { integer } from 'drizzle-orm/pg-core/columns';
import { pgTable } from 'drizzle-orm/pg-core/table';
import { problemSchema } from '../problemSchema';
import { packageSchema } from '../packageSchema';

export const problemsToPackageSchema = pgTable('problems_to_packages', {
    problemId: integer('problem_id')
        .references(() => problemSchema.id)
        .notNull(),
    packageId: integer('package_id')
        .references(() => packageSchema.id)
        .notNull(),
});
