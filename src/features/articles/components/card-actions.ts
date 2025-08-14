"use server";

import { unpublishArticle, publishArticle } from "@/features/articles/db/articles";
import { getCurrentUser } from "@/services/clerk";
import { canAccessAdminPages } from "@/permissons/general";
import { revalidatePath } from "next/cache";

export async function unpublishArticleFromCard(articleId: string) {
    // Get current user with role information
    const currentUser = await getCurrentUser({ allData: true });
    
    if (!currentUser || !currentUser.user) {
        return { error: "You must be logged in to unpublish articles" };
    }

    // Check admin permissions
    if (!canAccessAdminPages({ role: currentUser.role })) {
        return { error: "You do not have permission to unpublish articles" };
    }

    try {
        const article = await unpublishArticle({ id: articleId });
        
        // Revalidate the admin articles page to show updated status
        revalidatePath("/admin/articles");
        
        return { success: true, article };
    } catch (error) {
        console.error("Failed to unpublish article:", error);
        return { error: "Failed to unpublish article. Please try again." };
    }
}

export async function publishArticleFromCard(articleId: string) {
    // Get current user with role information
    const currentUser = await getCurrentUser({ allData: true });
    
    if (!currentUser || !currentUser.user) {
        return { error: "You must be logged in to publish articles" };
    }

    // Check admin permissions
    if (!canAccessAdminPages({ role: currentUser.role })) {
        return { error: "You do not have permission to publish articles" };
    }

    try {
        const article = await publishArticle({ id: articleId });
        
        // Revalidate the admin articles page to show updated status
        revalidatePath("/admin/articles");
        
        return { success: true, article };
    } catch (error) {
        console.error("Failed to publish article:", error);
        return { error: "Failed to publish article. Please try again." };
    }
}