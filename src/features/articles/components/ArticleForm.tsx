"use client";

import { useState } from "react";
import { JSONContent } from "novel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArticleEditor } from "./ArticleEditor";

type ArticleFormProps = {
  initialTitle?: string;
  initialContent?: JSONContent;
  initialStatus?: "draft" | "published" | "archived";
  onSave: (title: string, content: string) => Promise<{ error?: string; success?: boolean; article?: any }>;
  onPublish?: (title: string, content: string) => Promise<{ error?: string; success?: boolean; article?: any; published?: boolean }>;
  onUnpublish?: (title: string, content: string) => Promise<{ error?: string; success?: boolean; article?: any; unpublished?: boolean }>;
  saveButtonText?: string;
  pageTitle: string;
  isEditing?: boolean;
};

export function ArticleForm({ 
  initialTitle = "", 
  initialContent, 
  initialStatus = "draft",
  onSave, 
  onPublish,
  onUnpublish,
  saveButtonText = "Save",
  pageTitle,
  isEditing = false
}: ArticleFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState<JSONContent | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUnpublishing, setIsUnpublishing] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    if (!content) {
      alert("Please add some content");
      return;
    }

    setIsSaving(true);
    try {
      console.log("Saving article with content:", JSON.stringify(content, null, 2));
      console.log("Content object direct:", content);
      console.log("Content stringified then parsed:", JSON.parse(JSON.stringify(content)));
      // Pre-stringify the content to preserve all properties
      const contentString = JSON.stringify(content);
      console.log("Sending contentString:", contentString);
      const result = await onSave(title, contentString);
      
      if (result.error) {
        alert(result.error);
      } else {
        alert(`Article ${isEditing ? 'updated' : 'saved'} successfully!`);
        console.log(`${isEditing ? 'Updated' : 'Saved'} article:`, result.article);
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

    if (!content) {
      alert("Please add some content");
      return;
    }

    setIsPublishing(true);
    try {
      const contentString = JSON.stringify(content);
      const result = await onPublish(title, contentString);
      
      if (result.error) {
        alert(result.error);
      } else {
        alert("Article published successfully!");
        console.log("Published article:", result.article);
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
      const result = await onUnpublish(title, contentString);
      
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

        {/* Save Buttons */}
        <div className="flex gap-3 mb-6">
          <Button 
            variant="outline"
            onClick={handleSave}
            disabled={isSaving || isPublishing || isUnpublishing || !title.trim()}
          >
            {isSaving ? `${isEditing ? 'Updating' : 'Saving'}...` : saveButtonText}
          </Button>
          
          {/* Show Publish button for draft or archived articles */}
          {onPublish && (initialStatus === "draft" || initialStatus === "archived") && (
            <Button 
              onClick={handlePublish}
              disabled={isSaving || isPublishing || isUnpublishing || !title.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              {isPublishing ? "Publishing..." : "Publish"}
            </Button>
          )}
          
          {/* Show Unpublish button only if article is published */}
          {onUnpublish && initialStatus === "published" && (
            <Button 
              onClick={handleUnpublish}
              disabled={isSaving || isPublishing || isUnpublishing || !title.trim()}
              variant="destructive"
            >
              {isUnpublishing ? "Unpublishing..." : "Unpublish"}
            </Button>
          )}
        </div>

        <ArticleEditor 
          initialContent={initialContent}
          onContentChange={(newContent) => {
            console.log("ArticleForm setting content:", JSON.stringify(newContent, null, 2));
            setContent(newContent);
          }}
        />
      </div>
    </>
  );
}