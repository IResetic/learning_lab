"use client";

import {
  EditorContent,
  EditorRoot,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandList,
  EditorCommandItem,
  JSONContent,
  handleCommandNavigation,
  StarterKit,
  Placeholder,
  EditorBubble,
  EditorBubbleItem,
} from "novel";
import { useState, useRef } from "react";
import { Editor } from "@tiptap/react";
import { cn } from "@/lib/utils";
import { createSuggestionItemsWithUpload, createSlashCommand } from "./slash-command";
import { PositionableImage } from "./PositionableImage";

type ArticleEditorProps = {
  initialContent?: JSONContent;
  onContentChange: (content: JSONContent) => void;
};

export function ArticleEditor({ initialContent, onContentChange }: ArticleEditorProps) {
  const [content, setContent] = useState<JSONContent>(
    initialContent || {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "" }],
        },
      ],
    }
  );
  
  const editorRef = useRef<Editor | null>(null);
  const [, forceUpdate] = useState({});

  // Simple drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const uploadImage = async (file: File): Promise<string | null> => {
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
      console.error('Image upload error:', error);
      alert('Failed to upload image. Please try again.');
      return null;
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile && editorRef.current) {
      const src = await uploadImage(imageFile);
      if (src) {
        editorRef.current?.chain().focus().setImage({ src, position: 'start' }).createParagraphNear().run();
      }
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    const imageItem = items.find(item => item.type.startsWith('image/'));
    
    if (imageItem && editorRef.current) {
      const file = imageItem.getAsFile();
      if (file) {
        const src = await uploadImage(file);
        if (src) {
          editorRef.current?.chain().focus().setImage({ src, position: 'start' }).createParagraphNear().run();
        }
      }
    }
  };

  const suggestionItems = createSuggestionItemsWithUpload(uploadImage);
  const slashCommand = createSlashCommand(uploadImage);

  const extensions = [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3, 4]
      },
      bulletList: {
        keepMarks: true,
        keepAttributes: false,
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false,
      },
    }),
    PositionableImage.configure({}),
    Placeholder.configure({
      placeholder: "Type '/' for commands...",
      showOnlyWhenEditable: true,
      showOnlyCurrent: false,
      includeChildren: true,
    }),
    slashCommand
  ];

  const handleContentUpdate = (newContent: JSONContent) => {
    setContent(newContent);
    onContentChange(newContent);
  };

  return (
    <div 
      className="min-h-[500px] border rounded-lg overflow-hidden cursor-text"
      onClick={(e) => {
        // If clicking on empty space, focus the editor at the beginning
        const target = e.target as HTMLElement;
        if (target.classList.contains('ProseMirror') || target.closest('.ProseMirror')) {
          return; // Let ProseMirror handle clicks within content
        }
        // Focus at the beginning of the document using TipTap commands
        if (editorRef.current) {
          editorRef.current.chain().focus().setTextSelection(0).run();
        }
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onPaste={handlePaste}
    >
      <EditorRoot>
        <EditorContent
          className="min-h-[500px] w-full p-4 prose prose-lg dark:prose-invert max-w-full focus:outline-none"
          initialContent={content}
          extensions={extensions}
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            attributes: {
              class: "prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full",
            },
          }}
          onCreate={({ editor }) => {
            editorRef.current = editor;
          }}
          onUpdate={({ editor }) => {
            const json = editor.getJSON();
            handleContentUpdate(json);
          }}
          onSelectionUpdate={() => {
            // Force re-render for bubble menu active states
            forceUpdate({});
          }}
        >
          <EditorBubble
            tippyOptions={{
              placement: "top",
            }}
            className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl"
          >
            {editorRef.current?.isActive("positionableImage") ? (
              <>
                {/* Image positioning controls */}
                <EditorBubbleItem
                  onSelect={(editor) => {
                    editor.chain().focus().updateImagePosition('start').run();
                  }}
                  className={cn(
                    "p-2 transition-all hover:bg-muted",
                    editorRef.current?.getAttributes("positionableImage")?.position === "start"
                      ? "bg-muted text-foreground" 
                      : "text-muted-foreground"
                  )}
                >
                  <div className="flex items-center justify-center" title="Align left">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 19h18v2H3zm0-2h10v2H3zm0-4h18v2H3zm0-4h10v2H3zm0-4h18v2H3z"/>
                    </svg>
                  </div>
                </EditorBubbleItem>
                
                <div className="h-8 w-px bg-border" />
                
                <EditorBubbleItem
                  onSelect={(editor) => {
                    editor.chain().focus().updateImagePosition('center').run();
                  }}
                  className={cn(
                    "p-2 transition-all hover:bg-muted",
                    editorRef.current?.getAttributes("positionableImage")?.position === "center"
                      ? "bg-muted text-foreground" 
                      : "text-muted-foreground"
                  )}
                >
                  <div className="flex items-center justify-center" title="Align center">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 19h18v2H3zm4-2h10v2H7zm-4-4h18v2H3zm4-4h10v2H7zm-4-4h18v2H3z"/>
                    </svg>
                  </div>
                </EditorBubbleItem>
                
                <div className="h-8 w-px bg-border" />
                
                <EditorBubbleItem
                  onSelect={(editor) => {
                    editor.chain().focus().updateImagePosition('end').run();
                  }}
                  className={cn(
                    "p-2 transition-all hover:bg-muted",
                    editorRef.current?.getAttributes("positionableImage")?.position === "end"
                      ? "bg-muted text-foreground" 
                      : "text-muted-foreground"
                  )}
                >
                  <div className="flex items-center justify-center" title="Align right">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 19h18v2H3zm8-2h10v2H11zm-8-4h18v2H3zm8-4h10v2H11zm-8-4h18v2H3z"/>
                    </svg>
                  </div>
                </EditorBubbleItem>
              </>
            ) : (
              <>
                {/* Text formatting controls */}
                <EditorBubbleItem
                  onSelect={(editor) => {
                    editor.chain().focus().toggleBold().run();
                  }}
                  className={cn(
                    "p-2 transition-all hover:bg-muted",
                    editorRef.current?.isActive("bold") 
                      ? "bg-muted text-foreground" 
                      : "text-muted-foreground"
                  )}
                >
                  <div className="flex items-center justify-center">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/>
                    </svg>
                  </div>
                </EditorBubbleItem>
                
                <div className="h-8 w-px bg-border" />
                
                <EditorBubbleItem
                  onSelect={(editor) => {
                    editor.chain().focus().toggleItalic().run();
                  }}
                  className={cn(
                    "p-2 transition-all hover:bg-muted",
                    editorRef.current?.isActive("italic") 
                      ? "bg-muted text-foreground" 
                      : "text-muted-foreground"
                  )}
                >
                  <div className="flex items-center justify-center">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4h-8z"/>
                    </svg>
                  </div>
                </EditorBubbleItem>
              </>
            )}
          </EditorBubble>

          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={item.command}
                  className="flex w-full items-center space-x-2 rounded-sm px-2 py-1 text-left text-sm hover:bg-slate-100 aria-selected:bg-slate-200 aria-selected:text-slate-900 data-[selected=true]:bg-slate-200 data-[selected=true]:text-slate-900"
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-muted bg-background">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>
        </EditorContent>
      </EditorRoot>
    </div>
  );
}