import { decimal, integer, json, pgTable, varchar } from 'drizzle-orm/pg-core';

export const results = pgTable('results', {
    token: varchar('token', { length: 40 }).primaryKey(),
    stdout: json('stdout').$type<string>().notNull(),
    statusId: integer('status_id').notNull(),
    memory: integer('memory').notNull(),
    time: decimal('time', { precision: 6, scale: 3 }).notNull(),
});

export type NewResult = typeof results.$inferInsert;
export type Result = typeof results.$inferSelect;
