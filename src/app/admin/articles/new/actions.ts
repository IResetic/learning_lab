"use server";

import { insertArticle } from "@/features/articles/db/articles";
import { auth } from "@clerk/nextjs/server";
import { JSONContent } from "novel";
import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema/user";
import { eq } from "drizzle-orm";

export async function saveArticle(title: string, content: JSONContent) {
    const { userId } = await auth();
    
    if (!userId) {
        throw new Error("You must be logged in to save articles");
    }

    if (!title.trim()) {
        throw new Error("Title is required");
    }

    // Find the database user by Clerk ID, or create if doesn't exist
    let [user] = await db
        .select()
        .from(UserTable)
        .where(eq(UserTable.clerkUserId, userId));

    if (!user) {
        // User doesn't exist in database yet, create them
        // This can happen if webhook hasn't fired yet or failed
        const [newUser] = await db
            .insert(UserTable)
            .values({
                clerkUserId: userId,
                email: "unknown@example.com", // Placeholder - will be updated by webhook
                name: "User", // Placeholder - will be updated by webhook
                role: "user",
            })
            .returning();
        
        user = newUser;
    }

    // Generate slug from title
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

    const article = await insertArticle({
        title: title.trim(),
        slug,
        content,
        status: "draft",
        authorId: user.id, // Use the database user's UUID, not Clerk ID
    });

    return article;
}