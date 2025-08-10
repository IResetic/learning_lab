import React, {ReactNode, Suspense} from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import {Badge} from "@/components/ui/badge";

export default function AdminLayout({
    children
}: Readonly<{children: ReactNode}>) {
    return(
        <>
            <Navbar />
            { children }
        </>
    )
}

function Navbar() {
    return <header className="flex h-12 shadow bg-background z-10">
        <div className="container">
            <nav className="flex gap-4 h-full">
            <div className="mr-auto flex items-center gap-2">
                <Link className="text-lg hover:underline" href="/">
                    Learning Lab
                </Link>
                <Badge>Admin</Badge>
            </div>
            <Link
                className="hoover:bg-accent/10 flex items-center"
                href="/admin/articles">
                Articles
            </Link>

            <div className="size-8 self-center">
                <UserButton appearance={{
                    elements: {
                        userButtonAvatarBox: { width: "100%", height: "100%" }
                    }
                }}/>
            </div>
            </nav>
        </div>
    </header>
}