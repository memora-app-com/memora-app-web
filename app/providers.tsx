"use client";

import { Suspense, useState } from "react";

import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { LoadingIcon } from "@/components/LoadingIcon";

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {/* TODO: Switch to defualt theme "system" */}
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <Suspense fallback={<LoadingIcon />}>{children}</Suspense>
      </ThemeProvider>
      <Toaster />
    </QueryClientProvider>
  );
}
