import { type ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from '@/components/feedback/Toaster'
import { SessionProvider } from '@/features/auth/components/SessionProvider'
import { SessionIdleWatcher } from '@/features/auth/components/SessionIdleWatcher'
import { queryClient } from './query-client'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        {children}
        <Toaster />
        <SessionIdleWatcher />
      </SessionProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}