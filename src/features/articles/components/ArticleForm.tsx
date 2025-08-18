"use client";

import { useState, useEffect } from "react";
import { JSONContent } from "novel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArticleEditor } from "./ArticleEditor";

type ArticleFormProps = {
  initialTitle?: string;
  initialContent?: JSONContent;
  initialExcerpt?: string;
  initialStatus?: "draft" | "published" | "archived";
  onSave: (title: string, content: string, excerpt: string) => Promise<{ error?: string; success?: boolean; article?: any }>;
  onPublish?: (title: string, content: string, excerpt: string) => Promise<{ error?: string; success?: boolean; article?: any; published?: boolean }>;
  onUnpublish?: (title: string, content: string, excerpt: string) => Promise<{ error?: string; success?: boolean; article?: any; unpublished?: boolean }>;
  onDelete?: () => Promise<{ error?: string; success?: boolean; deleted?: boolean }>;
  saveButtonText?: string;
  pageTitle: string;
  isEditing?: boolean;
};

export function ArticleForm({ 
  initialTitle = "", 
  initialContent, 
  initialExcerpt = "",
  initialStatus = "draft",
  onSave, 
  onPublish,
  onUnpublish,
  onDelete,
  saveButtonText = "Save",
  pageTitle,
  isEditing = false
}: ArticleFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [excerpt, setExcerpt] = useState(initialExcerpt || "");
  const [content, setContent] = useState<JSONContent | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUnpublishing, setIsUnpublishing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Update excerpt when initialExcerpt changes (for edit mode)
  useEffect(() => {
    setExcerpt(initialExcerpt || "");
  }, [initialExcerpt]);

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    if (!content && !isEditing) {
      alert("Please add some content");
      return;
    }

    setIsSaving(true);
    try {
      const contentString = JSON.stringify(content || initialContent);
      const result = await onSave(title, contentString, excerpt);
      
      if (result.error) {
        alert(result.error);
      } else {
        alert(`Article ${isEditing ? 'updated' : 'saved'} successfully!`);
      }
    } catch (error) {
      console.error(`Failed to ${isEditing ? 'update' : 'save'} article:`, error);
      alert(`Failed to ${isEditing ? 'update' : 'save'} article. Please try again.`);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!onPublish) return;
    
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    if (!content && !isEditing) {
      alert("Please add some content");
      return;
    }

    setIsPublishing(true);
    try {
      const contentString = JSON.stringify(content || initialContent);
      const result = await onPublish(title, contentString, excerpt);
      
      if (result.error) {
        alert(result.error);
      } else {
        alert("Article published successfully!");
      }
    } catch (error) {
      console.error("Failed to publish article:", error);
      alert("Failed to publish article. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    if (!onUnpublish) return;
    
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    if (!content) {
      alert("Please add some content");
      return;
    }

    setIsUnpublishing(true);
    try {
      const contentString = JSON.stringify(content);
      const result = await onUnpublish(title, contentString, excerpt);
      
      if (result.error) {
        alert(result.error);
      } else {
        alert("Article unpublished successfully!");
        console.log("Unpublished article:", result.article);
      }
    } catch (error) {
      console.error("Failed to unpublish article:", error);
      alert("Failed to unpublish article. Please try again.");
    } finally {
      setIsUnpublishing(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    if (!confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await onDelete();
      
      if (result.error) {
        alert(result.error);
      } else {
        alert("Article deleted successfully!");
        // Navigation will be handled by the server action
      }
    } catch (error) {
      console.error("Failed to delete article:", error);
      alert("Failed to delete article. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="container my-6">
        <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
      </div>
      <div className="container">
        {/* Title Input */}
        <div className="mb-6">
          <Label htmlFor="title" className="text-base font-medium">
            Article Title
          </Label>
          <Input
            id="title"
            type="text"
            placeholder="Enter your article title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 text-lg"
            disabled={isSaving}
          />
        </div>

        {/* Excerpt Input */}
        <div className="mb-6">
          <Label htmlFor="excerpt" className="text-base font-medium">
            Article Summary
          </Label>
          <Textarea
            id="excerpt"
            placeholder="Enter a brief summary of your article (optional)..."
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="mt-2"
            rows={3}
            disabled={isSaving}
          />
          <p className="text-sm text-muted-foreground mt-1">
            This summary will be used for article previews and search results.
          </p>
        </div>

        {/* Save Buttons */}
        <div className="flex gap-3 mb-6">
          <Button 
            variant="outline"
            onClick={handleSave}
            disabled={isSaving || isPublishing || isUnpublishing || isDeleting || !title.trim()}
          >
            {isSaving ? `${isEditing ? 'Updating' : 'Saving'}...` : saveButtonText}
          </Button>
          
          {/* Show Publish button for draft or archived articles */}
          {onPublish && (initialStatus === "draft" || initialStatus === "archived") && (
            <Button 
              onClick={handlePublish}
              disabled={isSaving || isPublishing || isUnpublishing || isDeleting || !title.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              {isPublishing ? "Publishing..." : "Publish"}
            </Button>
          )}
          
          {/* Show Unpublish button only if article is published */}
          {onUnpublish && initialStatus === "published" && (
            <Button 
              onClick={handleUnpublish}
              disabled={isSaving || isPublishing || isUnpublishing || isDeleting || !title.trim()}
              variant="destructive"
            >
              {isUnpublishing ? "Unpublishing..." : "Unpublish"}
            </Button>
          )}
          
          {/* Show Delete button only when editing */}
          {onDelete && isEditing && (
            <Button 
              onClick={handleDelete}
              disabled={isSaving || isPublishing || isUnpublishing || isDeleting}
              variant="destructive"
              className="ml-auto"
            >
              {isDeleting ? "Deleting..." : "Delete Article"}
            </Button>
          )}
        </div>

        <ArticleEditor 
          initialContent={initialContent}
          onContentChange={(newContent) => {
            setContent(newContent);
          }}
        />
      </div>
    </>
  );
}