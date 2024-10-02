import {
    integer,
    pgTable,
    timestamp,
    varchar,
    serial,
} from 'drizzle-orm/pg-core';
import { contestSchema } from './contestSchema';

export const stageSchema = pgTable('stages', {
    id: serial('id').primaryKey(),
    contestId: integer('contest_id')
        .references(() => contestSchema.id, { onDelete: 'cascade' })
        .notNull(),
    name: varchar('name', { length: 64 }).notNull(),
    startDate: timestamp('starts', { withTimezone: true }).notNull(),
    endDate: timestamp('ends', { withTimezone: true }).notNull(),
});

export type NewStage = typeof stageSchema.$inferInsert;
export type Stage = typeof stageSchema.$inferSelect;
