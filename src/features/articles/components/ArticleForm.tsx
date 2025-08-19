"use client";

import { useState, useEffect } from "react";
import { JSONContent } from "novel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArticleEditor } from "./ArticleEditor";
import { useRouter } from "next/navigation";

type ArticleFormProps = {
  initialTitle?: string;
  initialContent?: JSONContent;
  initialExcerpt?: string;
  initialFeaturedImage?: string;
  initialStatus?: "draft" | "published" | "archived";
  onSave: (title: string, content: string, excerpt: string, featuredImage: string) => Promise<{ error?: string; success?: boolean; article?: any }>;
  onPublish?: (title: string, content: string, excerpt: string, featuredImage: string) => Promise<{ error?: string; success?: boolean; article?: any; published?: boolean }>;
  onUnpublish?: (title: string, content: string, excerpt: string, featuredImage: string) => Promise<{ error?: string; success?: boolean; article?: any; unpublished?: boolean }>;
  onDelete?: () => Promise<{ error?: string; success?: boolean; deleted?: boolean }>;
  saveButtonText?: string;
  pageTitle: string;
  isEditing?: boolean;
};

export function ArticleForm({ 
  initialTitle = "", 
  initialContent, 
  initialExcerpt = "",
  initialFeaturedImage = "",
  initialStatus = "draft",
  onSave, 
  onPublish,
  onUnpublish,
  onDelete,
  saveButtonText = "Save",
  pageTitle,
  isEditing = false
}: ArticleFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [excerpt, setExcerpt] = useState(initialExcerpt || "");
  const [featuredImage, setFeaturedImage] = useState(initialFeaturedImage || "");
  const [content, setContent] = useState<JSONContent | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUnpublishing, setIsUnpublishing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Update excerpt when initialExcerpt changes (for edit mode)
  useEffect(() => {
    setExcerpt(initialExcerpt || "");
  }, [initialExcerpt]);

  // Update featured image when initialFeaturedImage changes (for edit mode)
  useEffect(() => {
    setFeaturedImage(initialFeaturedImage || "");
  }, [initialFeaturedImage]);

  const uploadFeaturedImage = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }
      
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Featured image upload error:', error);
      alert('Failed to upload featured image. Please try again.');
      return null;
    }
  };

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setIsUploadingImage(true);
    const url = await uploadFeaturedImage(file);
    if (url) {
      setFeaturedImage(url);
    }
    setIsUploadingImage(false);
  };

  const handleRemoveFeaturedImage = () => {
    setFeaturedImage("");
  };

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
      const result = await onSave(title, contentString, excerpt, featuredImage);
      
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
      const result = await onPublish(title, contentString, excerpt, featuredImage);
      
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
      const result = await onUnpublish(title, contentString, excerpt, featuredImage);
      
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

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
      router.push("/admin/articles");
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

        {/* Featured Image */}
        <div className="mb-6">
          <Label htmlFor="featuredImage" className="text-base font-medium">
            Featured Image
          </Label>
          
          {featuredImage ? (
            <div className="mt-2 space-y-3">
              <div className="relative inline-block">
                <img 
                  src={featuredImage} 
                  alt="Featured image" 
                  className="w-full max-w-md h-48 object-cover rounded-lg border"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveFeaturedImage}
                  disabled={isSaving || isPublishing || isUnpublishing || isDeleting}
                >
                  Remove Image
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('featuredImageInput')?.click()}
                  disabled={isSaving || isPublishing || isUnpublishing || isDeleting || isUploadingImage}
                >
                  {isUploadingImage ? 'Uploading...' : 'Change Image'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('featuredImageInput')?.click()}
                disabled={isSaving || isPublishing || isUnpublishing || isDeleting || isUploadingImage}
              >
                {isUploadingImage ? 'Uploading...' : 'Upload Featured Image'}
              </Button>
            </div>
          )}
          
          <input
            id="featuredImageInput"
            type="file"
            accept="image/*"
            onChange={handleFeaturedImageUpload}
            className="hidden"
          />
          
          <p className="text-sm text-muted-foreground mt-1">
            This image will be displayed in the article list and previews. Max size: 5MB.
          </p>
        </div>

        {/* Save Buttons */}
        <div className="flex gap-3 mb-6">
          <Button 
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving || isPublishing || isUnpublishing || isDeleting}
          >
            Cancel
          </Button>
          
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