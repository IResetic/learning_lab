"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { AdminMobileNavigation } from "./AdminMobileNavigation";

export function AdminMobileMenuButton() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile Hamburger Menu Button */}
            <button 
                className="md:hidden flex items-center justify-center w-10 h-10 hover:bg-accent/50 rounded-xl transition-all duration-200 active:scale-95 group"
                aria-label="Toggle navigation menu"
                onClick={toggleMenu}
            >
                <div className="relative w-5 h-5">
                    <Menu 
                        size={20} 
                        className={`absolute inset-0 transition-all duration-300 ${
                            isOpen ? 'opacity-0 rotate-180 scale-75' : 'opacity-100 rotate-0 scale-100'
                        }`} 
                    />
                    <X 
                        size={20} 
                        className={`absolute inset-0 transition-all duration-300 ${
                            isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-75'
                        }`} 
                    />
                </div>
            </button>

            {/* Mobile Navigation Overlay */}
            <AdminMobileNavigation onToggle={toggleMenu} isOpen={isOpen} />
        </>
    );
}