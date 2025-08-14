"use server";

import { insertArticle } from "@/features/articles/db/articles";
import { JSONContent } from "novel";
import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema/user";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/services/clerk";
import { canAccessAdminPages } from "@/permissons/general";

export async function saveArticle(title: string, content: JSONContent) {
    // Get current user with role information
    const currentUser = await getCurrentUser({ allData: true });
    
    if (!currentUser || !currentUser.user) {
        return { error: "You must be logged in to save articles" };
    }

    // Check admin permissions
    if (!canAccessAdminPages({ role: currentUser.role })) {
        return { error: "You do not have permission to save articles" };
    }

    if (!title.trim()) {
        return { error: "Title is required" };
    }

    // Generate slug from title
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

    try {
        const article = await insertArticle({
            title: title.trim(),
            slug,
            content,
            status: "draft",
            authorId: currentUser.user.id, // Use the database user's UUID
        });

        return { success: true, article };
    } catch (error) {
        console.error("Failed to save article:", error);
        return { error: "Failed to save article. Please try again." };
    }
}

export async function saveAndPublishArticle(title: string, content: JSONContent) {
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

    // Generate slug from title
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

    try {
        const article = await insertArticle({
            title: title.trim(),
            slug,
            content,
            status: "published",
            publishedAt: new Date(),
            authorId: currentUser.user.id, // Use the database user's UUID
        });

        return { success: true, article, published: true };
    } catch (error) {
        console.error("Failed to publish article:", error);
        return { error: "Failed to publish article. Please try again." };
    }
}