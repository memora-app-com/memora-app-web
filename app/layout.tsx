import type { Metadata } from "next";

import Providers from "./providers";

import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/utils/tailwind";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Memora",
  description: "Metadata description (REPLACE-THIS)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
