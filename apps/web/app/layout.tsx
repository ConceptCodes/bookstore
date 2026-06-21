import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Bookstore",
  description: "A mock bookstore with an Eve agent concierge.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
