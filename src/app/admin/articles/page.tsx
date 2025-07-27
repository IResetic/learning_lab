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

        <div>Text placeholder</div>
    </div>
}