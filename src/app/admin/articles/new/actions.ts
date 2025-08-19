"use server";

import { insertArticle } from "@/features/articles/db/articles";
import { JSONContent } from "novel";
import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema/user";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/services/clerk";
import { canAccessAdminPages } from "@/permissons/general";

export async function saveArticle(title: string, contentString: string, excerpt: string, featuredImage: string) {
    let content: JSONContent;
    try {
        content = JSON.parse(contentString) as JSONContent;
    } catch (error) {
        console.error("Failed to parse content:", error);
        return { error: "Invalid content format" };
    }
    
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
            excerpt: excerpt.trim() || null,
            featuredImage: featuredImage.trim() || null,
            status: "draft",
            authorId: currentUser.user.id, // Use the database user's UUID
        });

        return { success: true, article };
    } catch (error) {
        console.error("Failed to save article:", error);
        return { error: "Failed to save article. Please try again." };
    }
}

export async function saveAndPublishArticle(title: string, contentString: string, excerpt: string, featuredImage: string) {
    const content = JSON.parse(contentString) as JSONContent;
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
            excerpt: excerpt.trim() || null,
            featuredImage: featuredImage.trim() || null,
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