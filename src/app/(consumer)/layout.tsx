import React, {ReactNode, Suspense} from "react";
import Link from "next/link";
import {SignedIn} from "@clerk/nextjs";

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
            <Link className={"mr-auto text-lg hover:underline px-2 flex items-center"} href="/">
                Learning Lab
            </Link>
            <Suspense>
                <SignedIn>
                </SignedIn>
            </Suspense>
        </nav>
    </header>
}