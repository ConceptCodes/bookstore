import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Bookstore Admin",
  description: "Admin dashboard for the mock bookstore.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
