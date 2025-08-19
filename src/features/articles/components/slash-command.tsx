import { Command, createSuggestionItems, renderItems } from "novel";

export const createSuggestionItemsWithUpload = (uploadImage: (file: File) => Promise<string | null>) => createSuggestionItems([
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
    title: "Heading 3",
    description: "Small section heading.",
    searchTerms: ["subtitle", "small"],
    icon: <div className="flex h-10 w-10 items-center justify-center rounded-sm border bg-background">
      <p className="text-sm font-medium">H3</p>
    </div>,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 3 })
        .run();
    },
  },
  {
    title: "Heading 4",
    description: "Extra small section heading.",
    searchTerms: ["subtitle", "extra small"],
    icon: <div className="flex h-10 w-10 items-center justify-center rounded-sm border bg-background">
      <p className="text-xs font-normal">H4</p>
    </div>,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 4 })
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
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleBulletList()
        .run();
    },
  },
  {
    title: "Image",
    description: "Upload an image from your computer.",
    searchTerms: ["photo", "picture", "media"],
    icon: <div className="flex h-10 w-10 items-center justify-center rounded-sm border bg-background">
      <div className="text-sm">🖼️</div>
    </div>,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .run();
      
      // Create file input for image upload
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          // Validate file
          if (!file.type.includes('image/')) {
            alert('Please select an image file');
            return;
          }
          if (file.size / 1024 / 1024 > 5) {
            alert('Image size should be less than 5MB');
            return;
          }
          
          const src = await uploadImage(file);
          if (src) {
            editor
              .chain()
              .focus()
              .setImage({ src })
              .createParagraphNear()
              .run();
          }
        }
      };
      input.click();
    },
  },
]);

export const createSlashCommand = (uploadImage: (file: File) => Promise<string | null>) => Command.configure({
  suggestion: {
    items: () => createSuggestionItemsWithUpload(uploadImage),
    render: renderItems,
  },
});

// Keep default export for backward compatibility
export const suggestionItems = createSuggestionItemsWithUpload(async () => null);
export const slashCommand = createSlashCommand(async () => null);