"use client";

import { PageHeader } from "@/components/PageHeader";
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
} from "novel";
import { useState } from "react";
import { slashCommand, suggestionItems } from "./slash-command";

export default function NewArticlesPage() {
    const [content, setContent] = useState<JSONContent>({
        type: "doc",
        content: [
            {
                type: "paragraph",
                content: [{ type: "text", text: "" }],
            },
        ],
    });

    const extensions = [
        StarterKit.configure({
            heading: {
                levels: [1, 2, 3]
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
        Placeholder.configure({
            placeholder: "Type '/' for commands...",
            showOnlyWhenEditable: true,
            showOnlyCurrent: false,
            includeChildren: false,
        }),
        slashCommand
    ];

    return (
        <>
            <div className="container my-6">
                <PageHeader title="New Articles" />
            </div>
            <div className="w-full max-w-screen-lg mx-auto px-4">
                <div className="min-h-[500px] border rounded-lg overflow-hidden">
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
                            onUpdate={({ editor }) => {
                                const json = editor.getJSON();
                                setContent(json);
                            }}
                        >
                            <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
                                <EditorCommandEmpty className="px-2 text-muted-foreground">
                                    No results
                                </EditorCommandEmpty>
                                <EditorCommandList>
                                    {suggestionItems.map((item) => (
                                        <EditorCommandItem
                                            value={item.title}
                                            onCommand={item.command}
                                            className="flex w-full items-center space-x-2 rounded-sm px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
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
            </div>
        </>
    );
}
