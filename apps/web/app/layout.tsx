import type { ReactNode } from "react";
import { CUSTOMER_USER_ID, getCart } from "@bookstore/db";
import "./globals.css";
import { StorefrontShell } from "@/components/storefront-shell";

export const metadata = {
  title: "Bookstore",
  description: "A mock bookstore with an Eve agent concierge.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cart = getCart(CUSTOMER_USER_ID);

  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <StorefrontShell cartItemCount={cart.itemCount}>
          {children}
        </StorefrontShell>
      </body>
    </html>
  );
}
