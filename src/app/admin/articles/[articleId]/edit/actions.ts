"use server";

import { updateArticle, getArticleById } from "@/features/articles/db/articles";
import { JSONContent } from "novel";
import { getCurrentUser } from "@/services/clerk";
import { canAccessAdminPages } from "@/permissons/general";

export async function updateArticleAction(articleId: string, title: string, content: JSONContent) {
    // Get current user with role information
    const currentUser = await getCurrentUser({ allData: true });
    
    if (!currentUser || !currentUser.user) {
        return { error: "You must be logged in to update articles" };
    }

    // Check admin permissions
    if (!canAccessAdminPages({ role: currentUser.role })) {
        return { error: "You do not have permission to update articles" };
    }

    if (!title.trim()) {
        return { error: "Title is required" };
    }

    // Verify article exists and user owns it (optional: you could add ownership check)
    const existingArticle = await getArticleById(articleId);
    if (!existingArticle) {
        return { error: "Article not found" };
    }

    // Generate slug from title
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

    try {
        const article = await updateArticle(
            { id: articleId },
            {
                title: title.trim(),
                slug,
                content,
            }
        );

        return { success: true, article };
    } catch (error) {
        console.error("Failed to update article:", error);
        return { error: "Failed to update article. Please try again." };
    }
}