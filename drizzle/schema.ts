import { relations, sql } from "drizzle-orm";
import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';

export const inspirations = pgTable('inspirations', {
  id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
  prompt: text("prompt"),
  content: text("content"),

});

export const inspiration_owners = pgTable('inspiration_owners', {
  id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
  userId: varchar('userId', {length: 256}),
  inspirationId: uuid('inspirationId')
});

export const inspirationRelations = relations(inspirations, ({ many }) => ({
	owners: many(inspiration_owners)
}));

export const ownershipRelations = relations(inspiration_owners, ({ one }) => ({
	sourceInspiration: one(inspirations, {
    fields: [inspiration_owners.inspirationId],
    references: [inspirations.id]
  })
}));

export type Inspiration = typeof inspirations.$inferSelect;