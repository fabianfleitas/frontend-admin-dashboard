import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  sessionLoaded: boolean
  setUser: (user: User | null) => void
  setSessionLoaded: (loaded: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  sessionLoaded: false,
  setUser: (user) => set({ user }),
  setSessionLoaded: (sessionLoaded) => set({ sessionLoaded }),
}))