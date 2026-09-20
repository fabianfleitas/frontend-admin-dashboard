import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCategory } from '../api/documents.service'
import type { CategoryIn } from '../types'

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ categoriaId, input }: { categoriaId: number; input: CategoryIn }) =>
      updateCategory(categoriaId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}