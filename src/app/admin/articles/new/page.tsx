import { ArticleForm } from "@/features/articles/components/ArticleForm";
import { saveArticle } from "./actions";

export default function NewArticlesPage() {
    const handleSave = async (title: string, content: any) => {
        "use server";
        return await saveArticle(title, content);
    };

    return (
        <ArticleForm
            onSave={handleSave}
            saveButtonText="Save"
            pageTitle="New Article"
            isEditing={false}
        />
    );
}
