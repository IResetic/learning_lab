import { pgEnum, pgTable, text, timestamp, json, uuid } from "drizzle-orm/pg-core"
import { createdAt, id, updatedAt } from "../schemaHelpers"
import { relations } from "drizzle-orm"
import { UserTable } from "./user"

export const articleStatuses = ["draft", "published", "archived"] as const
export type ArticleStatus = (typeof articleStatuses)[number]
export const articleStatusEnum = pgEnum("article_status", articleStatuses)

export const ArticleTable = pgTable("articles", {
    id,
    title: text().notNull(),
    slug: text().notNull().unique(),
    
    // Single source of truth - JSON content from editor
    content: json().notNull(),
    
    // Optional excerpt for previews
    excerpt: text(),
    
    // Publishing workflow
    status: articleStatusEnum().notNull().default("draft"),
    publishedAt: timestamp({ withTimezone: true }),
    
    // Author relationship
    authorId: uuid().notNull().references(() => UserTable.id),
    
    // SEO fields (optional)
    metaTitle: text(),
    metaDescription: text(),
    featuredImage: text(),
    
    // Soft delete support
    deletedAt: timestamp({ withTimezone: true }),
    createdAt,
    updatedAt,
})

// Relations
export const articleRelations = relations(ArticleTable, ({ one }) => ({
    author: one(UserTable, {
        fields: [ArticleTable.authorId],
        references: [UserTable.id],
    }),
}))