import { supabase } from '@/lib/supabase'
import { http } from '@/lib/http'
import { mapAuthError } from '@/features/auth/lib/auth-messages'
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

export async function signInWithEmailPassword(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(mapAuthError(error))
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

export function updateMe(body: { full_name?: string | null }): Promise<UserOut> {
  return http.put<UserOut>('/me', { body })
}