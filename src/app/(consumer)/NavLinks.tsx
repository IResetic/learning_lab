"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavLinks() {
  const pathname = usePathname();

  const links = [
    { href: "/about", label: "About" },
    { href: "/", label: "Articles" },
  ];

  return (
    <div className="flex">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            className={cn(
              "flex items-center px-3 py-2 transition-colors",
              isActive
                ? "bg-primary/10 text-primary font-medium hover:bg-primary/15"
                : "text-foreground hover:bg-accent/10"
            )}
            href={link.href}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}