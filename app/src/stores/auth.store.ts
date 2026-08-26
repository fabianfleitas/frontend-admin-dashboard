import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'
import type { UserOut } from '@/features/users/types'

interface AuthState {
  user: User | null
  profile: UserOut | null
  sessionLoaded: boolean
  setUser: (user: User | null) => void
  setProfile: (profile: UserOut | null) => void
  setSessionLoaded: (loaded: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  sessionLoaded: false,
  setUser: (user) => set({ user, ...(user ? {} : { profile: null }) }),
  setProfile: (profile) => set({ profile }),
  setSessionLoaded: (sessionLoaded) => set({ sessionLoaded }),
}))