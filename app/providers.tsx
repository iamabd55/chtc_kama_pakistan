"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  // Memoize QueryClient to prevent re-initialization on rerenders
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 10 * 60 * 1000, // 10 minutes (formerly "cacheTime")
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1,
          },
        },
      }),
    []
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

