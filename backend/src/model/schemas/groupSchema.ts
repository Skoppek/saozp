import { pgTable } from 'drizzle-orm/pg-core/table';
import { integer, serial, varchar } from 'drizzle-orm/pg-core/columns';
import { userSchema } from './userSchema';

export const groupSchema = pgTable('groups', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 128 }).notNull(),
    owner: integer('owner_id')
        .references(() => userSchema.id)
        .notNull(),
});

export type NewGroup = typeof groupSchema.$inferInsert;
