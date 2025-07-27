type CACHE_TAG =
    | "users"
    | "articles"


export function getGlobalTag(tag: CACHE_TAG) {
    return `global:${tag}` as const
}

export function getIdTag(tag: CACHE_TAG, id: string) {
    return `id:${id}-${tag}` as const
}

export function getUserTag(tag: CACHE_TAG, userId: string) {
    return `user:${userId}-${tag}` as const
}

export function getArticleTag(tag: CACHE_TAG, articleId: string) {
    return `article:${articleId}-${tag}` as const
}