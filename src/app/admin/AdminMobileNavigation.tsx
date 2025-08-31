"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

interface AdminMobileNavigationProps {
  onToggle: () => void;
  isOpen: boolean;
}

export function AdminMobileNavigation({ onToggle, isOpen }: AdminMobileNavigationProps) {
  const pathname = usePathname();

  const links = [
    { href: "/admin/articles", label: "Articles" },
    { href: "/", label: "Home" },
  ];

  return (
    <>
      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40 animate-in fade-in duration-200"
            onClick={onToggle}
          />

          {/* Mobile Menu */}
          <div className="fixed top-14 md:top-12 left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-xl z-50 animate-in slide-in-from-top-2 duration-300">
            <div className="py-6">
              {/* Navigation Links */}
              <nav className="space-y-1 mb-4">
                {links.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      className={cn(
                        "flex items-center w-full py-3.5 transition-all duration-200 text-[15px] font-medium",
                        isActive
                          ? "bg-gray-100/70 text-black pl-4"
                          : "text-foreground hover:bg-gray-50 active:scale-[0.98] rounded-xl px-4"
                      )}
                      href={link.href}
                      onClick={onToggle}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              {/* User Profile Section */}
              <div className="border-t border-border/30 pt-0.5">
                <div className="flex items-center w-full gap-3 px-4 py-3.5 rounded-xl bg-gray-50/50">
                  <div className="size-9 flex-shrink-0">
                    <UserButton appearance={{
                      elements: {
                        userButtonAvatarBox: { 
                          width: "100%", 
                          height: "100%",
                          borderRadius: "12px"
                        }
                      }
                    }}/>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">Admin Profile</span>
                    <span className="text-xs text-muted-foreground">Manage account</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}