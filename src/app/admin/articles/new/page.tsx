import { ArticleForm } from "@/features/articles/components/ArticleForm";
import { saveArticle, saveAndPublishArticle } from "./actions";

export default function NewArticlesPage() {
    const handleSave = async (title: string, content: any) => {
        "use server";
        return await saveArticle(title, content);
    };

    const handlePublish = async (title: string, content: any) => {
        "use server";
        return await saveAndPublishArticle(title, content);
    };

    return (
        <ArticleForm
            onSave={handleSave}
            onPublish={handlePublish}
            saveButtonText="Save"
            pageTitle="New Article"
            isEditing={false}
        />
    );
}
