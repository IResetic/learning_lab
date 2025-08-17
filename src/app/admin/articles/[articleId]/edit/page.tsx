import { getArticleById } from "@/features/articles/db/articles";
import { ArticleForm } from "@/features/articles/components/ArticleForm";
import { updateArticleAction, publishArticleAction, unpublishArticleAction } from "./actions";
import { notFound } from "next/navigation";
import { JSONContent } from "novel";

type EditArticlePageProps = {
    params: {
        articleId: string;
    };
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
    const { articleId } = await params;
    const article = await getArticleById(articleId);

    if (!article) {
        notFound();
    }

    const handleUpdate = async (title: string, contentString: string) => {
        "use server";
        return await updateArticleAction(articleId, title, contentString);
    };

    const handlePublish = async (title: string, contentString: string) => {
        "use server";
        return await publishArticleAction(articleId, title, contentString);
    };

    const handleUnpublish = async (title: string, contentString: string) => {
        "use server";
        return await unpublishArticleAction(articleId, title, contentString);
    };

    return (
        <ArticleForm
            initialTitle={article.title}
            initialContent={article.content as JSONContent}
            initialStatus={article.status}
            onSave={handleUpdate}
            onPublish={handlePublish}
            onUnpublish={handleUnpublish}
            saveButtonText="Update"
            pageTitle="Edit Article"
            isEditing={true}
        />
    );
}