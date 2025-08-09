import { ArticleTable } from "@/drizzle/schema/article";
import { db } from "@/drizzle/db";
import { eq, and, isNull } from "drizzle-orm";
import { revalidateArticleCache } from "@/features/articles/db/cache";

export async function insertArticle(data: typeof ArticleTable.$inferInsert) {
    const [newArticle] = await db
        .insert(ArticleTable)
        .values(data)
        .returning()

    if (newArticle == null) throw new Error("Failed to create article")
    
    revalidateArticleCache(newArticle.id, newArticle.slug, newArticle.authorId)

    return newArticle
}

export async function updateArticle(
    { id }: { id: string },
    data: Partial<typeof ArticleTable.$inferInsert>
) {
    const [updatedArticle] = await db
        .update(ArticleTable)
        .set({
            ...data,
            updatedAt: new Date()
        })
        .where(and(
            eq(ArticleTable.id, id),
            isNull(ArticleTable.deletedAt)
        ))
        .returning()

    if (updatedArticle == null) throw new Error("Failed to update article")
    
    revalidateArticleCache(updatedArticle.id, updatedArticle.slug, updatedArticle.authorId)

    return updatedArticle
}

export async function deleteArticle({ id }: { id: string }) {
    const [deletedArticle] = await db
        .update(ArticleTable)
        .set({
            deletedAt: new Date(),
            updatedAt: new Date()
        })
        .where(and(
            eq(ArticleTable.id, id),
            isNull(ArticleTable.deletedAt)
        ))
        .returning()

    if (deletedArticle == null) throw new Error("Failed to delete article")
    
    revalidateArticleCache(deletedArticle.id, deletedArticle.slug, deletedArticle.authorId)

    return deletedArticle
}

export async function getArticleById(id: string) {
    const [article] = await db
        .select()
        .from(ArticleTable)
        .where(and(
            eq(ArticleTable.id, id),
            isNull(ArticleTable.deletedAt)
        ))

    return article || null
}

export async function getArticleBySlug(slug: string) {
    const [article] = await db
        .select()
        .from(ArticleTable)
        .where(and(
            eq(ArticleTable.slug, slug),
            isNull(ArticleTable.deletedAt)
        ))

    return article || null
}

export async function getPublishedArticleBySlug(slug: string) {
    const [article] = await db
        .select()
        .from(ArticleTable)
        .where(and(
            eq(ArticleTable.slug, slug),
            eq(ArticleTable.status, "published"),
            isNull(ArticleTable.deletedAt)
        ))

    return article || null
}

export async function publishArticle({ id }: { id: string }) {
    return updateArticle({ id }, {
        status: "published",
        publishedAt: new Date()
    })
}

export async function unpublishArticle({ id }: { id: string }) {
    return updateArticle({ id }, {
        status: "draft",
        publishedAt: null
    })
}