import { useQuery } from '@tanstack/react-query'
import { listCategories } from '../api/documents.service'
import type { CategoryOut } from '../types'

const CATEGORY_LIMIT = 200

export function useCategories() {
  return useQuery({
    queryKey: ['categories', CATEGORY_LIMIT],
    queryFn: () => listCategories({ limit: CATEGORY_LIMIT, offset: 0 }),
  })
}

export interface CategoriesLookup {
  byId: Map<number, CategoryOut>
  active: CategoryOut[]
  getName: (id: number | null | undefined) => string | null
  getLabel: (id: number | null | undefined) => string | null
}

export function useCategoriesLookup(): CategoriesLookup {
  const { data } = useCategories()
  const all = data?.items ?? []
  const byId = new Map(all.map((c) => [c.id, c]))
  const active = all.filter((c) => c.activo)
  return {
    byId,
    active,
    getName: (id) => (id != null ? byId.get(id)?.nombre ?? null : null),
    getLabel: (id) => (id != null ? byId.get(id)?.nombre ?? null : null),
  }
}