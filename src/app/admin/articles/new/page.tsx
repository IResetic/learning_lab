import { ArticleForm } from "@/features/articles/components/ArticleForm";
import { saveArticle, saveAndPublishArticle } from "./actions";

export default function NewArticlesPage() {
    const handleSave = async (title: string, contentString: string, excerpt: string, featuredImage: string) => {
        "use server";
        return await saveArticle(title, contentString, excerpt, featuredImage);
    };

    const handlePublish = async (title: string, contentString: string, excerpt: string, featuredImage: string) => {
        "use server";
        return await saveAndPublishArticle(title, contentString, excerpt, featuredImage);
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
