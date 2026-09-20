import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCategory } from '../api/documents.service'
import type { CategoryIn } from '../types'

export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CategoryIn) => createCategory(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}