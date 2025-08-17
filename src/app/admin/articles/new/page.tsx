import { ArticleForm } from "@/features/articles/components/ArticleForm";
import { saveArticle, saveAndPublishArticle } from "./actions";

export default function NewArticlesPage() {
    const handleSave = async (title: string, contentString: string) => {
        "use server";
        return await saveArticle(title, contentString);
    };

    const handlePublish = async (title: string, contentString: string) => {
        "use server";
        return await saveAndPublishArticle(title, contentString);
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
