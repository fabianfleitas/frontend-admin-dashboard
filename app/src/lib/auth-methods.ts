/**
 * Flags de métodos de inicio de sesión disponibles en la UI.
 *
 * Se leen una sola vez de `import.meta.env`. Un valor distinto de `'true'`
 * desactiva el método; vacío o sin definir cae al `fallback` para no romper
 * despliegues existentes.
 */
export function parseAuthFlag(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback
  const normalized = value.trim().toLowerCase()
  if (!normalized) return fallback
  return normalized === 'true'
}

export const AUTH_EMAIL_PASSWORD_ENABLED = parseAuthFlag(
  import.meta.env.VITE_AUTH_EMAIL_PASSWORD_ENABLED,
  false,
)

export const AUTH_GOOGLE_ENABLED = parseAuthFlag(import.meta.env.VITE_AUTH_GOOGLE_ENABLED, true)
