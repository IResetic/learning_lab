import React from "react";
import {PageHeader} from "@/components/PageHeader";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function ArticlesPage() {
    return <div className="container my-6">
        <PageHeader title="Articles">
            <Button asChild>
                <Link href="/admin/articles/new">New Article</Link>
            </Button>
        </PageHeader>

        <div className="mt-8">
            <div className="rounded-lg border">
                <div className="border-b p-4">
                    <h3 className="font-medium">All Articles</h3>
                    <p className="text-sm text-muted-foreground">
                        Manage your articles, create new ones, and update existing content.
                    </p>
                </div>
                <div className="p-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                        <svg className="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="mt-4 text-lg font-medium">No articles yet</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Get started by creating your first article.
                    </p>
                </div>
            </div>
        </div>
    </div>
}