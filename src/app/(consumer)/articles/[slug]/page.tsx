import { getPublishedArticleBySlug } from "@/features/articles/db/articles";
import { notFound } from "next/navigation";
import { ArticleReader } from "@/features/articles/components/ArticleReader";
import { formatDistanceToNow } from "date-fns";

type ArticlePageProps = {
    params: {
        slug: string;
    };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    const { slug } = await params;
    const article = await getPublishedArticleBySlug(slug);

    if (!article) {
        notFound();
    }

    const publishedDate = article.publishedAt 
        ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })
        : formatDistanceToNow(new Date(article.createdAt), { addSuffix: true });

    return (
        <div className="container max-w-4xl my-8">
            <article className="prose prose-lg dark:prose-invert max-w-none">
                <header className="mb-8 not-prose">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">
                        {article.title}
                    </h1>
                    <div className="text-muted-foreground">
                        Published {publishedDate}
                    </div>
                </header>
                
                <ArticleReader content={article.content} />
            </article>
        </div>
    );
}