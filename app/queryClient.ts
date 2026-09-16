import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 30, // Unused data remains in cache for 30 mins
      refetchOnWindowFocus: false, // Prevents aggressive background re-fetches during dev
      retry: 1,
      staleTime: 1000 * 60 * 5, // Data stays fresh for 5 mins (avoids redundant refetches),
    },
  },
})
