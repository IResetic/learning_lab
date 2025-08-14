"use client";

import { ArticleTable } from "@/drizzle/schema/article";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { unpublishArticleFromCard, publishArticleFromCard } from "./card-actions";
import { useState } from "react";

type ArticleCardProps = {
    article: typeof ArticleTable.$inferSelect;
}

function extractTextPreview(content: any): string {
    // Extract plain text from TipTap JSON content
    if (!content || !content.content) return "";
    
    const extractText = (node: any): string => {
        if (node.type === "text") {
            return node.text || "";
        }
        
        if (node.content && Array.isArray(node.content)) {
            return node.content.map(extractText).join(" ");
        }
        
        return "";
    };
    
    const text = content.content.map(extractText).join(" ");
    return text.slice(0, 150) + (text.length > 150 ? "..." : "");
}

export function ArticleCard({ article }: ArticleCardProps) {
    const preview = extractTextPreview(article.content);
    const timeAgo = formatDistanceToNow(new Date(article.createdAt), { addSuffix: true });
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUnpublish = async () => {
        setIsUpdating(true);
        try {
            const result = await unpublishArticleFromCard(article.id);
            if (result.error) {
                alert(result.error);
            } else {
                // The page will automatically update due to revalidatePath
                console.log("Article unpublished successfully");
            }
        } catch (error) {
            console.error("Failed to unpublish:", error);
            alert("Failed to unpublish article. Please try again.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handlePublish = async () => {
        setIsUpdating(true);
        try {
            const result = await publishArticleFromCard(article.id);
            if (result.error) {
                alert(result.error);
            } else {
                // The page will automatically update due to revalidatePath
                console.log("Article published successfully");
            }
        } catch (error) {
            console.error("Failed to publish:", error);
            alert("Failed to publish article. Please try again.");
        } finally {
            setIsUpdating(false);
        }
    };
    
    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold leading-none tracking-tight line-clamp-2">
                                {article.title}
                            </h3>
                            <Badge 
                                variant={article.status === "published" ? "default" : "secondary"}
                                className="ml-auto shrink-0"
                            >
                                {article.status === "published" ? "Published" : "Draft"}
                            </Badge>
                        </div>
                        
                        {preview && (
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                                {preview}
                            </p>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Created {timeAgo}</span>
                            {article.publishedAt && (
                                <span>
                                    Published {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                    <Button asChild size="sm" className="flex-1" disabled={isUpdating}>
                        <Link href={`/admin/articles/${article.id}/edit`}>
                            Edit
                        </Link>
                    </Button>
                    
                    {article.status === "draft" && (
                        <Button 
                            size="sm" 
                            variant="outline"
                            onClick={handlePublish}
                            disabled={isUpdating}
                        >
                            {isUpdating ? "Publishing..." : "Publish"}
                        </Button>
                    )}
                    
                    {article.status === "published" && (
                        <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={handleUnpublish}
                            disabled={isUpdating}
                        >
                            {isUpdating ? "Unpublishing..." : "Unpublish"}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}