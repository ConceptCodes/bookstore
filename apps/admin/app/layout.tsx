import type { ReactNode } from "react";
import "./globals.css";
import { AdminSidebar } from "@/components/admin-sidebar";

export const metadata = {
  title: "Bookstore Admin",
  description: "Admin dashboard for the mock bookstore.",
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="flex min-h-screen">
          <AdminSidebar />
          <main className="flex-1 overflow-x-hidden">
            <div className="mx-auto w-full max-w-6xl px-6 py-8">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
