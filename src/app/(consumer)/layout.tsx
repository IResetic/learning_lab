import React, { ReactNode, Suspense } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/services/clerk"
import {canAccessAdminPages} from "@/permissons/general";

export default function ConsumerLayout({
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
        <nav className="flex gap-4 container">
            <Link className={"mr-auto text-lg hover:underline flex items-center"} href="/">
                Learning Lab
            </Link>
            <Suspense>
                <SignedIn>
                     <AdminLink />
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
                </SignedIn>
            </Suspense>
            <Suspense>
                <SignedOut>
                    <Button className="self-center" asChild>
                        <SignInButton>Sign In</SignInButton>
                    </Button>
                </SignedOut>
            </Suspense>
        </nav>
    </header>
}

async function AdminLink() {
    const user = await getCurrentUser({allData: true})

    console.log(canAccessAdminPages(user))
    if (!canAccessAdminPages(user)) return null

    return (
        <Link className="hover:bg-accent/10 flex items-center px-2" href="/admin">
            Admin
        </Link>
    )
}