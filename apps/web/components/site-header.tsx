"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenIcon, MessageCircleIcon, ShoppingCartIcon } from "lucide-react";
import { Button } from "@bookstore/ui";
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
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <BookOpenIcon className="size-4" />
          </span>
          <span className="hidden sm:inline">Bookstore</span>
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
                  "rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                  active && "bg-accent text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5"
            onClick={chat.toggle}
          >
            <MessageCircleIcon className="size-4" />
            <span className="hidden sm:inline">Ask Page</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="relative gap-1.5"
            asChild
          >
            <Link href="/cart" prefetch>
              <ShoppingCartIcon className="size-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartItemCount > 0 && (
                <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground tabular-nums">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
