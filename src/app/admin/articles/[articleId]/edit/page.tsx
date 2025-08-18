import { getArticleById } from "@/features/articles/db/articles";
import { ArticleForm } from "@/features/articles/components/ArticleForm";
import { updateArticleAction, publishArticleAction, unpublishArticleAction, deleteArticleAction } from "./actions";
import { notFound, redirect } from "next/navigation";
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

    const handleUpdate = async (title: string, contentString: string, excerpt: string) => {
        "use server";
        return await updateArticleAction(articleId, title, contentString, excerpt);
    };

    const handlePublish = async (title: string, contentString: string, excerpt: string) => {
        "use server";
        return await publishArticleAction(articleId, title, contentString, excerpt);
    };

    const handleUnpublish = async (title: string, contentString: string, excerpt: string) => {
        "use server";
        return await unpublishArticleAction(articleId, title, contentString, excerpt);
    };

    const handleDelete = async () => {
        "use server";
        const result = await deleteArticleAction(articleId);
        if (result.success) {
            redirect("/admin/articles");
        }
        return result;
    };

    return (
        <ArticleForm
            initialTitle={article.title}
            initialContent={article.content as JSONContent}
            initialExcerpt={article.excerpt ?? ""}
            initialStatus={article.status}
            onSave={handleUpdate}
            onPublish={handlePublish}
            onUnpublish={handleUnpublish}
            onDelete={handleDelete}
            saveButtonText="Update"
            pageTitle="Edit Article"
            isEditing={true}
        />
    );
}