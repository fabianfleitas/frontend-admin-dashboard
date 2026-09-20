import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteCategory } from '../api/documents.service'

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (categoriaId: number) => deleteCategory(categoriaId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categories'] })
      void queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })
}