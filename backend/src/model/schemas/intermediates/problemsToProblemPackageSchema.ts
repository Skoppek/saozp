import { integer } from 'drizzle-orm/pg-core/columns';
import { pgTable } from 'drizzle-orm/pg-core/table';
import { problemSchema } from '../problemSchema';
import { problemPackageSchema } from '../problemPackageSchema';

export const problemsToProblemPackageSchema = pgTable(
    'problems_to_problem_packages',
    {
        problemId: integer('problem_id')
            .references(() => problemSchema.id)
            .notNull(),
        packageId: integer('package_id')
            .references(() => problemPackageSchema.id)
            .notNull(),
    },
);
