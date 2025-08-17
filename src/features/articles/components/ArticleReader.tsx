"use client";

import { EditorContent, EditorRoot, StarterKit } from "novel";
import { JSONContent } from "novel";
import { Heading } from "@tiptap/extension-heading";
import { PositionableImage } from "./PositionableImage";

type ArticleReaderProps = {
  content: JSONContent;
};

export function ArticleReader({ content }: ArticleReaderProps) {
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
  ];

  return (
    <div className="w-full">
      <EditorRoot>
        <EditorContent
          className="prose prose-lg dark:prose-invert max-w-none focus:outline-none"
          initialContent={content}
          extensions={extensions}
          editable={false}
          editorProps={{
            attributes: {
              class: "prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-none",
            },
          }}
        />
      </EditorRoot>
    </div>
  );
}