"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenIcon, MessageCircleIcon, ShoppingCartIcon } from "lucide-react";
import { cn } from "@bookstore/ui";
import { useChatSheet } from "./storefront-shell";

const NAV_LINKS: { href: string; label: string }[] = [
  { href: "/", label: "Books" },
  { href: "/orders", label: "Orders" },
  { href: "/support", label: "Support" },
];

export function SiteHeader({ cartItemCount }: { cartItemCount: number }) {
  const pathname = usePathname();
  const chat = useChatSheet();

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm transition-transform group-hover:-rotate-3">
            <BookOpenIcon className="size-4" strokeWidth={2} />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-white/10"
            />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-semibold tracking-tight text-foreground">
              Bookstore
            </span>
            <span className="mt-0.5 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-muted-foreground/80">
              Est. for readers
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:text-foreground",
                  active && "text-foreground",
                )}
              >
                {link.label}
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-x-2 -bottom-[calc(0.5rem+1px)] h-0.5 rounded-full bg-[oklch(0.65_0.12_65)]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={chat.toggle}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              "border-[oklch(0.65_0.12_65/0.3)] bg-[oklch(0.65_0.12_65/0.08)] text-foreground",
              "hover:border-[oklch(0.65_0.12_65/0.5)] hover:bg-[oklch(0.65_0.12_65/0.14)]",
            )}
          >
            <MessageCircleIcon className="size-4 text-[oklch(0.55_0.13_65)]" />
            <span className="hidden sm:inline">Ask Paige</span>
          </button>
          <Link
            href="/cart"
            prefetch
            className="relative inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ShoppingCartIcon className="size-4" />
            <span className="hidden sm:inline">Cart</span>
            {cartItemCount > 0 && (
              <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground tabular-nums">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
