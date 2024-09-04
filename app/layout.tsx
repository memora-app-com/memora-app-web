import type { Metadata } from "next";

import Providers from "./providers";

import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/utils/tailwind";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Memora App",
  description: "Capture. Share. Re-live. Create lasting memories.",
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
