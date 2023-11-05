import { integer, pgEnum, pgTable, serial, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

export const extensions = pgTable('extensions', {
  id: serial('id').primaryKey(),
  prompt: varchar('name', { length: 256 }),
});