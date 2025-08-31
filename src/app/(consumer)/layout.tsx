import React, { ReactNode, Suspense } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/services/clerk"
import {canAccessAdminPages} from "@/permissons/general";
import { NavLinks } from "./NavLinks";
import { MobileMenuButton } from "./MobileMenuButton";

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
    return (
        <header className="flex h-14 md:h-12 shadow bg-background z-10 sticky top-0">
            <nav className="flex gap-4 container items-center">
                <Link className={"mr-auto text-lg hover:underline flex items-center"} href="/">
                    Learning Lab
                </Link>
                
                {/* Desktop Navigation Links */}
                <div className="hidden md:flex">
                    <NavLinks />
                </div>
                
                <Suspense>
                    <SignedIn>
                        <div className="size-8 self-center">
                            <UserButton appearance={{
                                elements: {
                                    userButtonAvatarBox: { width: "100%", height: "100%" }
                                }
                            }}/>
                        </div>
                    </SignedIn>
                </Suspense>
                <div className="hidden md:block">
                    <Suspense>
                        <SignedOut>
                            <Button className="self-center" asChild>
                                <SignInButton>Sign In</SignInButton>
                            </Button>
                        </SignedOut>
                    </Suspense>
                </div>

                {/* Mobile Menu */}
                <MobileMenuButton />
            </nav>
        </header>
    )
}

async function AdminLink() {
    const user = await getCurrentUser({allData: true})

    if (!canAccessAdminPages(user)) return null

    return (
        <Link className="hover:bg-accent/10 flex items-center px-2" href="/admin">
            Admin
        </Link>
    )
}

