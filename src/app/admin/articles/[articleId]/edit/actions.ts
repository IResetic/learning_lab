"use server";

import { updateArticle, getArticleById, publishArticle, unpublishArticle } from "@/features/articles/db/articles";
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

export async function publishArticleAction(articleId: string, title: string, content: JSONContent) {
    // Get current user with role information
    const currentUser = await getCurrentUser({ allData: true });
    
    if (!currentUser || !currentUser.user) {
        return { error: "You must be logged in to publish articles" };
    }

    // Check admin permissions
    if (!canAccessAdminPages({ role: currentUser.role })) {
        return { error: "You do not have permission to publish articles" };
    }

    if (!title.trim()) {
        return { error: "Title is required" };
    }

    // Verify article exists
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
        // First update the article content and title
        await updateArticle(
            { id: articleId },
            {
                title: title.trim(),
                slug,
                content,
            }
        );

        // Then publish it
        const article = await publishArticle({ id: articleId });

        return { success: true, article, published: true };
    } catch (error) {
        console.error("Failed to publish article:", error);
        return { error: "Failed to publish article. Please try again." };
    }
}

export async function unpublishArticleAction(articleId: string, title: string, content: JSONContent) {
    // Get current user with role information
    const currentUser = await getCurrentUser({ allData: true });
    
    if (!currentUser || !currentUser.user) {
        return { error: "You must be logged in to unpublish articles" };
    }

    // Check admin permissions
    if (!canAccessAdminPages({ role: currentUser.role })) {
        return { error: "You do not have permission to unpublish articles" };
    }

    if (!title.trim()) {
        return { error: "Title is required" };
    }

    // Verify article exists
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
        // First update the article content and title
        await updateArticle(
            { id: articleId },
            {
                title: title.trim(),
                slug,
                content,
            }
        );

        // Then unpublish it
        const article = await unpublishArticle({ id: articleId });

        return { success: true, article, unpublished: true };
    } catch (error) {
        console.error("Failed to unpublish article:", error);
        return { error: "Failed to unpublish article. Please try again." };
    }
}