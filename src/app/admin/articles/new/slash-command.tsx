import { Command, createSuggestionItems, renderItems } from "novel";

export const suggestionItems = createSuggestionItems([
  {
    title: "Text",
    description: "Just start writing with plain text.",
    searchTerms: ["p", "paragraph"],
    icon: <div className="flex h-10 w-10 items-center justify-center rounded-sm border bg-background">📝</div>,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode("paragraph", "paragraph")
        .run();
    },
  },
  {
    title: "Heading 1",
    description: "Big section heading.",
    searchTerms: ["title", "big", "large"],
    icon: <div className="flex h-10 w-10 items-center justify-center rounded-sm border bg-background">
      <p className="text-lg font-bold">H1</p>
    </div>,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 1 })
        .run();
    },
  },
  {
    title: "Heading 2", 
    description: "Medium section heading.",
    searchTerms: ["subtitle", "medium"],
    icon: <div className="flex h-10 w-10 items-center justify-center rounded-sm border bg-background">
      <p className="text-base font-semibold">H2</p>
    </div>,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 2 })
        .run();
    },
  },
  {
    title: "Bullet List",
    description: "Create a simple bullet list.",
    searchTerms: ["list", "unordered", "bullets"],
    icon: <div className="flex h-10 w-10 items-center justify-center rounded-sm border bg-background">
      <div className="text-sm">• •</div>
    </div>,
    command: ({ editor, range }) => {
      console.log("Bullet List command triggered", { editor, range });
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleBulletList()
        .run();
    },
  },
]);

export const slashCommand = Command.configure({
  suggestion: {
    items: () => suggestionItems,
    render: renderItems,
  },
});