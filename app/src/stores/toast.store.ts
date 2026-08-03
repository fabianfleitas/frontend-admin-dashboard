import { create } from 'zustand'

export type ToastTone = 'success' | 'error' | 'info'

export interface ToastItem {
  id: string
  tone: ToastTone
  message: string
  description?: string
}

interface ToastState {
  toasts: ToastItem[]
  push: (toast: Omit<ToastItem, 'id'>) => void
  dismiss: (id: string) => void
  clear: () => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (toast) =>
    set((state) => {
      const id = crypto.randomUUID()
      setTimeout(() => {
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
      }, 4000)
      return { toasts: [...state.toasts, { ...toast, id }] }
    }),
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}))

export const toast = {
  success: (message: string, description?: string) =>
    useToastStore.getState().push({ tone: 'success', message, description }),
  error: (message: string, description?: string) =>
    useToastStore.getState().push({ tone: 'error', message, description }),
  info: (message: string, description?: string) =>
    useToastStore.getState().push({ tone: 'info', message, description }),
}