import { getPublishedArticles } from "@/features/articles/db/articles";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

type HomePageProps = {
  searchParams: {
    page?: string;
  };
}

function extractTextPreview(content: any): string {
  // Extract plain text from TipTap JSON content
  if (!content || !content.content) return "";
  
  const extractText = (node: any): string => {
    if (node.type === "text") {
      return node.text || "";
    }
    
    if (node.content && Array.isArray(node.content)) {
      return node.content.map(extractText).join(" ");
    }
    
    return "";
  };
  
  const text = content.content.map(extractText).join(" ");
  return text.slice(0, 200) + (text.length > 200 ? "..." : "");
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam || "1");
  
  const { articles, pagination } = await getPublishedArticles({
    page,
    limit: 10,
  });

  return (
    <div className="container max-w-4xl my-8">
      {articles.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No articles published yet</h2>
          <p className="text-muted-foreground">Check back later for new content!</p>
        </div>
      ) : (
        <>
          <div className="space-y-8">
            {articles.map((article) => {
              const preview = article.excerpt || extractTextPreview(article.content);
              const publishedDate = article.publishedAt 
                ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })
                : formatDistanceToNow(new Date(article.createdAt), { addSuffix: true });

              return (
                <div key={article.id} className="border-b border-border pb-8">
                  <Link 
                    href={`/articles/${article.slug}`}
                    className="block group hover:bg-muted/10 transition-colors rounded-lg p-4 -m-4"
                  >
                    <article>
                      <div className="flex gap-6">
                        <div className="flex-1 space-y-3">
                          <h2 className="text-2xl font-semibold tracking-tight group-hover:text-primary transition-colors">
                            {article.title}
                          </h2>
                          
                          {preview && (
                            <p className="text-muted-foreground leading-relaxed">
                              {preview}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              Published {publishedDate}
                            </span>
                          </div>
                        </div>
                        {article.featuredImage && (
                          <div className="flex-shrink-0 w-48">
                            <img 
                              src={article.featuredImage} 
                              alt={article.title}
                              className="w-full h-auto object-contain rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                    </article>
                  </Link>
                </div>
              );
            })}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              {pagination.hasPreviousPage && (
                <Button asChild variant="outline">
                  <Link href={`?page=${pagination.page - 1}`}>
                    Previous
                  </Link>
                </Button>
              )}
              
              <span className="flex items-center px-4 text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              
              {pagination.hasNextPage && (
                <Button asChild variant="outline">
                  <Link href={`?page=${pagination.page + 1}`}>
                    Next
                  </Link>
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
