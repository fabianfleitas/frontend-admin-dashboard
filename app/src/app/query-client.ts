import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/lib/http'
import { toast } from '@/stores/toast.store'

function extractErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (typeof error.detail === 'string') return error.detail
    if (
      typeof error.detail === 'object' &&
      error.detail !== null &&
      'message' in error.detail &&
      typeof (error.detail as { message: unknown }).message === 'string'
    ) {
      return (error.detail as { message: string }).message
    }
    return error.message
  }
  if (error instanceof Error) return error.message
  return 'Ocurrió un error inesperado al procesar la solicitud.'
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Si la query maneja su propio estado en UI vía ErrorState, no molestamos con toast invasivo
      // a menos que sea un fallo crítico tras reintentos
      if (query.state.data !== undefined) {
        toast.error('Error al actualizar datos', extractErrorMessage(error))
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      // Si la mutación ya definió su propio onError local, evitamos duplicar toast
      if (mutation.options.onError) return
      toast.error('Error en la operación', extractErrorMessage(error))
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30 * 1000,
    },
    mutations: {
      retry: 0,
    },
  },
})