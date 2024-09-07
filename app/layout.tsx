import type { Metadata } from "next";

import Providers from "./providers";

import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/utils/tailwind";
import localFont from "next/font/local";

const inter = Inter({ subsets: ["latin"] });

const budge = localFont({
  src: [
    {
      path: "../public/assets/fonts/BudgePair-Regular.otf",
      weight: "400",
    },
  ],
  variable: "--font-budge",
});

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
          inter.className,
          budge.variable
        )}
      >
        <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
