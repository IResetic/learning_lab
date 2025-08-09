import { getGlobalTag, getIdTag, getArticleTag, getUserTag } from "@/lib/dataCache"
import { revalidateTag } from "next/cache"

export function getArticleGlobalTag() {
    return getGlobalTag("articles")
}

export function getArticleIdTag(id: string) {
    return getIdTag("articles", id)
}

export function getArticleBySlugTag(slug: string) {
    return getArticleTag("articles", slug)
}

export function getUserArticlesTag(userId: string) {
    return getUserTag("articles", userId)
}

export function revalidateArticleCache(id: string, slug?: string, authorId?: string) {
    revalidateTag(getArticleGlobalTag())
    revalidateTag(getArticleIdTag(id))
    
    if (slug) {
        revalidateTag(getArticleBySlugTag(slug))
    }
    
    if (authorId) {
        revalidateTag(getUserArticlesTag(authorId))
    }
}