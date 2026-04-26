"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import LanguageSwitcher from "./LanguageSwitcher";

type NavItem = {
  href: string;
  label: string;
};

type Props = {
  navItems: NavItem[];
  children?: React.ReactNode;
};

export default function MobileMenu({ navItems, children }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const panel = open && (
    <div className="fixed inset-0 top-[65px] z-50 bg-[#0c0a09] md:hidden">
      <nav className="flex flex-col gap-1 px-4 pt-6">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className="rounded-lg px-4 py-3 text-lg text-stone-300 transition-colors hover:bg-white/5 hover:text-glow"
          >
            {item.label}
          </a>
        ))}
        <div className="mt-4 border-t border-white/10 pt-4">
          {children}
        </div>
        <div className="mt-4 border-t border-white/10 px-4 pt-4">
          <LanguageSwitcher />
        </div>
      </nav>
    </div>
  );

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-stone-400 transition-colors hover:text-white"
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {mounted && panel && createPortal(panel, document.body)}
    </div>
  );
}
