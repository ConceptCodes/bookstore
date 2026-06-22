"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenIcon,
  ExternalLinkIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  PackageIcon,
} from "lucide-react";
import { cn } from "@bookstore/ui";

const NAV_GROUPS: {
  label: string;
  items: { href: string; label: string; icon: typeof LayoutDashboardIcon }[];
}[] = [
  {
    label: "Operate",
    items: [
      { href: "/", label: "Overview", icon: LayoutDashboardIcon },
      { href: "/books", label: "Books", icon: BookOpenIcon },
      { href: "/orders", label: "Orders", icon: PackageIcon },
      { href: "/tickets", label: "Tickets", icon: LifeBuoyIcon },
      { href: "/faq", label: "FAQ", icon: HelpCircleIcon },
    ],
  },
];

export function AdminSidebar({ cartItemCount }: { cartItemCount?: number }) {
  const pathname = usePathname();
  void cartItemCount;

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r bg-muted/30">
      <div className="flex h-14 items-center gap-2 border-b px-5">
        <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <BookOpenIcon className="size-4" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold">Bookstore</p>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Admin
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto p-3">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="space-y-1">
            <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {group.label}
            </p>
            {group.items.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/80 hover:bg-accent hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" strokeWidth={2} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t p-3">
        <Link
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ExternalLinkIcon className="size-3.5" />
          View storefront
        </Link>
      </div>
    </aside>
  );
}
