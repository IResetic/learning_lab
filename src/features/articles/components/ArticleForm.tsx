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
  onSave: (title: string, content: JSONContent) => Promise<{ error?: string; success?: boolean; article?: any }>;
  saveButtonText?: string;
  pageTitle: string;
  isEditing?: boolean;
};

export function ArticleForm({ 
  initialTitle = "", 
  initialContent, 
  onSave, 
  saveButtonText = "Save",
  pageTitle,
  isEditing = false
}: ArticleFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState<JSONContent>(initialContent || {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: "" }],
      },
    ],
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    setIsSaving(true);
    try {
      const result = await onSave(title, content);
      
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
            disabled={isSaving || !title.trim()}
          >
            {isSaving ? `${isEditing ? 'Updating' : 'Saving'}...` : saveButtonText}
          </Button>
          <Button 
            onClick={() => {
              // TODO: Implement publish functionality
              console.log("Publish clicked");
            }}
            className="bg-primary hover:bg-primary/90"
          >
            Publish
          </Button>
        </div>

        <ArticleEditor 
          initialContent={content}
          onContentChange={setContent}
        />
      </div>
    </>
  );
}