import { supabase } from '@/lib/supabase'
import { http } from '@/lib/http'
import type { User } from '@supabase/supabase-js'
import type { UserOut } from '@/features/users/types'

export async function signInWithGoogle(): Promise<void> {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  })
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}

export async function getCurrentUser(): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export function getMe(): Promise<UserOut> {
  return http.get<UserOut>('/me')
}