"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavigationProps {
  onToggle: () => void;
  isOpen: boolean;
}

export function MobileNavigation({ onToggle, isOpen }: MobileNavigationProps) {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Articles" },
    { href: "/about", label: "About" },
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

              {/* Authentication Section */}
              <div className="border-t border-border/30 pt-0.5 space-y-1">
                <SignedIn>
                  {/* Admin Link for mobile */}
                  <Link
                    className="flex items-center w-full px-4 py-3.5 rounded-xl hover:bg-gray-50 transition-all duration-200 text-[15px] font-medium text-muted-foreground hover:text-foreground active:scale-[0.98]"
                    href="/admin"
                    onClick={onToggle}
                  >
                    Admin
                  </Link>
                  
                  {/* User Profile Section */}
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
                      <span className="text-sm font-medium text-foreground">Profile</span>
                      <span className="text-xs text-muted-foreground">Manage account</span>
                    </div>
                  </div>
                </SignedIn>
                
                <SignedOut>
                  <div className="flex items-center justify-center w-full px-4 py-1.5 rounded-xl hover:bg-gray-50 transition-all duration-200 active:scale-[0.98]">
                    <SignInButton>
                      <span className="text-lg font-semibold text-foreground">Sign In</span>
                    </SignInButton>
                  </div>
                </SignedOut>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}