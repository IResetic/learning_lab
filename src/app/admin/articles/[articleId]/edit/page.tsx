import { getArticleById } from "@/features/articles/db/articles";
import { ArticleForm } from "@/features/articles/components/ArticleForm";
import { updateArticleAction } from "./actions";
import { notFound } from "next/navigation";

type EditArticlePageProps = {
    params: {
        articleId: string;
    };
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
    const article = await getArticleById(params.articleId);

    if (!article) {
        notFound();
    }

    const handleUpdate = async (title: string, content: any) => {
        "use server";
        return await updateArticleAction(params.articleId, title, content);
    };

    return (
        <ArticleForm
            initialTitle={article.title}
            initialContent={article.content}
            onSave={handleUpdate}
            saveButtonText="Update"
            pageTitle="Edit Article"
            isEditing={true}
        />
    );
}