import { relations } from 'drizzle-orm'
import { pgTable, uuid, text, timestamp, primaryKey } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().notNull().primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  created_at: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().notNull().primaryKey(),
  title: text('title').notNull(),
  description: text('content'),
  url: text('url').notNull(),
  image_url: text('image_url'),
  user_id: uuid('user_id')
    .notNull()
    .references(() => users.id),
  created_at: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const postRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.user_id],
    references: [users.id],
  }),
  postTags: many(postOnTags),
}))

export const tags = pgTable('tags', {
  id: uuid('id').defaultRandom().notNull().primaryKey(),
  name: text('name').notNull(),
  user_id: uuid('user_id')
    .notNull()
    .references(() => users.id),
  created_at: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const tagRelations = relations(tags, ({ one, many }) => ({
  user: one(users, {
    fields: [tags.user_id],
    references: [users.id],
  }),
  posts: many(postOnTags),
}))

export const postOnTags = pgTable(
  'post_tags',
  {
    post_id: uuid('post_id')
      .notNull()
      .references(() => posts.id),
    tag_id: uuid('tag_id')
      .notNull()
      .references(() => tags.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.post_id, t.tag_id] }),
  }),
)

export const postOnTagsRelations = relations(postOnTags, ({ one }) => ({
  post: one(posts, {
    fields: [postOnTags.post_id],
    references: [posts.id],
  }),
  tag: one(tags, {
    fields: [postOnTags.tag_id],
    references: [tags.id],
  }),
}))
