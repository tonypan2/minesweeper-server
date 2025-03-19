import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Minesweeper server",
  description:
    "A server for playing Minesweeper. APIs return graphical representation of the game.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
