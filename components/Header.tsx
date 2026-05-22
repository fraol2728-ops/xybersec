"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  ChevronRight,
  Command,
  Menu,
  Search,
  TerminalSquare,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const { lang, isRTL } = useLanguage();
  const t = translations[lang];

  const navLinks = [
    { href: "/", label: t.navHome },
    { href: "/courses", label: "Courses" },
    { href: "/pricing", label: t.navPricing },
    { href: "/community", label: t.navCommunity },
  ];

  const commandPaletteLinks = [
    { href: "/", label: t.navHome },
    { href: "/dashboard", label: t.navDashboard },
    { href: "/courses", label: "Courses" },
    { href: "/pricing", label: t.navPricing },
    { href: "/community", label: t.navCommunity },
    { href: "/notes", label: t.navNotes },
  ];

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleCommandToggle = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((prev) => !prev);
      }

      if (event.key === "Escape") {
        setCommandOpen(false);
      }
    };

    window.addEventListener("keydown", handleCommandToggle);
    return () => window.removeEventListener("keydown", handleCommandToggle);
  }, []);

  useEffect(() => {
    if (!commandOpen) {
      setQuery("");
    }
  }, [commandOpen]);

  const filteredLinks = useMemo(
    () =>
      commandPaletteLinks.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase()),
      ),
    [commandPaletteLinks, query],
  );

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b border-zinc-800/80 bg-[#050505]/95 shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-all duration-300",
          isScrolled
            ? "bg-[#020202]/98 shadow-[0_12px_35px_rgba(0,0,0,0.55)]"
            : "bg-[#050505]/95",
        )}
      >
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 ">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 sm:gap-3"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-cyan-400/35 bg-[#0b1229] shadow-[0_0_25px_rgba(34,211,238,0.22)] transition group-hover:border-cyan-300/70">
              <Image
                src="/logo.png"
                alt="XyberSec logo"
                width={30}
                height={30}
                className="h-7 w-7 object-contain"
                priority
              />
            </span>
            <div className="leading-tight">
              <p className="whitespace-nowrap text-sm font-semibold text-zinc-100 sm:text-base">
                Xyber<span className="text-cyan-300">Sec</span>
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                href={link.href}
                label={link.label}
                isScrolled={isScrolled}
                isActive={
                  link.href === "/courses"
                    ? pathname === "/courses" || pathname.startsWith("/courses/")
                    : pathname === link.href
                }
              />
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            

            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="inline-flex h-10 min-w-44 items-center justify-between rounded-lg border border-cyan-400/20 bg-[#0d1430]/70 px-3 text-sm text-zinc-300 transition hover:border-cyan-300/40 hover:text-cyan-200"
            >
              <span className="inline-flex items-center gap-2">
                <Search className="h-4 w-4" />
                {t.search}
              </span>
              <span className="inline-flex items-center gap-1 rounded border border-cyan-400/20 px-1.5 py-0.5 text-xs text-zinc-400">
                <Command className="h-3 w-3" />K
              </span>
            </button>

            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  className={cn(
                    "hover:bg-cyan-400/10 hover:text-cyan-200",
                    "text-zinc-100",
                  )}
                >
                  {t.signIn}
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className={cn(
                    "border-cyan-400/30 bg-transparent hover:bg-cyan-400/10 hover:text-cyan-200",
                    "text-zinc-100",
                  )}
                >
                  {t.navDashboard}
                </Button>
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 ring-1 ring-cyan-400/40",
                  },
                }}
              />
            </SignedIn>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-300 hover:bg-cyan-400/10 hover:text-cyan-200 md:hidden"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </nav>

        <div
          className={cn(
            "overflow-hidden border-t border-cyan-400/10 bg-[#060b1d]/95 backdrop-blur-xl transition-all duration-300 md:hidden",
            mobileOpen ? "max-h-[80vh]" : "max-h-0 border-transparent",
          )}
        >
          <div className="space-y-1 px-4 py-4">
            
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="mb-2 flex w-full items-center gap-2 rounded-md border border-cyan-400/20 px-3 py-2 text-sm text-zinc-200"
            >
              <Search className="h-4 w-4" /> {t.search} (⌘/Ctrl + K)
            </button>

            <MobileNavLink
              href="/"
              label={t.navHome}
              isActive={pathname === "/"}
            />
            {navLinks.slice(1).map((link) => (
              <MobileNavLink
                key={link.label}
                href={link.href}
                label={link.label}
                isActive={pathname === link.href}
              />
            ))}

            <div className="my-2 h-px bg-border/70" />

            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-zinc-200 hover:bg-cyan-400/10 hover:text-cyan-200"
                >
                  {t.signIn}
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Link href="/dashboard" className="block">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-zinc-200 hover:bg-cyan-400/10 hover:text-cyan-200"
                >
                  {t.navDashboard}
                </Button>
              </Link>
              <div className="px-3 py-2">
                <UserButton />
              </div>
            </SignedIn>
          </div>
        </div>
      </header>

      <CommandPalette
        open={commandOpen}
        query={query}
        setQuery={setQuery}
        setOpen={setCommandOpen}
        filteredLinks={filteredLinks}
        searchNavigation={t.searchNavigation}
        noNavigationResults={t.noNavigationResults}
        commandPalette={t.commandPalette}
        isRTL={isRTL}
      />
    </>
  );
}

function NavLink({
  href,
  label,
  isScrolled,
  isActive,
  isNew,
  newLabel,
}: {
  href: string;
  label: string;
  isScrolled: boolean;
  isActive?: boolean;
  isNew?: boolean;
  newLabel?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition hover:bg-cyan-400/10 hover:text-cyan-200",
        isActive
          ? "bg-cyan-400/12 text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.12)]"
          : isScrolled
            ? "text-zinc-100"
            : "text-zinc-200",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <span>{label}</span>
      {isNew ? (
        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
          {newLabel}
        </span>
      ) : null}
    </Link>
  );
}

function MobileNavLink({
  href,
  label,
  isActive,
  isNew,
  newLabel,
}: {
  href: string;
  label: string;
  isActive?: boolean;
  isNew?: boolean;
  newLabel?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition hover:bg-cyan-400/10 hover:text-cyan-200",
        isActive ? "bg-cyan-400/12 text-cyan-200" : "text-zinc-200",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <span>{label}</span>
      {isNew ? (
        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
          {newLabel}
        </span>
      ) : null}
    </Link>
  );
}

function CommandPalette({
  open,
  query,
  setQuery,
  setOpen,
  filteredLinks,
  searchNavigation,
  noNavigationResults,
  commandPalette,
  isRTL,
}: {
  open: boolean;
  query: string;
  setQuery: (value: string) => void;
  setOpen: (value: boolean) => void;
  filteredLinks: { href: string; label: string }[];
  searchNavigation: string;
  noNavigationResults: string;
  commandPalette: string;
  isRTL: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/70 px-4 pt-24 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          setOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setOpen(false);
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label={commandPalette}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-xl rounded-2xl border border-cyan-400/30 bg-[#070d24] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.65)]">
        <div className="mb-3 flex items-center gap-3 rounded-xl border border-cyan-400/20 bg-[#0b1430] px-3 py-2">
          <Search className="h-4 w-4 text-zinc-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchNavigation}
            className={cn(
              "w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500",
              isRTL ? "text-right" : "text-left",
            )}
          />
        </div>

        <div className="space-y-2">
          {filteredLinks.length > 0 ? (
            filteredLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl border border-cyan-400/10 bg-[#0a1128] px-4 py-3 text-sm text-zinc-200 transition hover:border-cyan-300/30 hover:bg-[#0d1736] hover:text-cyan-200"
              >
                <span className="inline-flex items-center gap-3">
                  <TerminalSquare className="h-4 w-4 text-cyan-300" />
                  {link.label}
                </span>
                <ChevronRight className="h-4 w-4 text-zinc-500" />
              </Link>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-cyan-400/20 px-4 py-6 text-center text-sm text-zinc-400">
              {noNavigationResults}{" "}
              <span className="text-cyan-300">{query}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
