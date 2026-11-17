import { useCallback, useEffect, useRef } from 'react'

export const IDLE_EVENTS = [
  'mousemove',
  'mousedown',
  'keydown',
  'scroll',
  'touchstart',
  'click',
] as const

interface UseIdleTimeout {
  /** Reinicia ambos timers (aviso y cierre). Llamar desde "Continuar sesión". */
  reset: () => void
}

/**
 * Controla la inactividad de la sesión (S7).
 * - Dispara `onWarning` a `timeoutMs - warningMs` de inactividad.
 * - Dispara `onTimeout` a `timeoutMs` si no hay actividad.
 * - Se rearma con cada evento de actividad.
 * Requiere `enabled` (sesión activa) y timeout > 0.
 */
export function useIdleTimeout(
  enabled: boolean,
  timeoutMs: number,
  onTimeout: () => void,
  warningMs = 0,
  onWarning?: () => void,
): UseIdleTimeout {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const warningRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onTimeoutRef = useRef(onTimeout)
  const onWarningRef = useRef(onWarning)
  onTimeoutRef.current = onTimeout
  onWarningRef.current = onWarning

  const clear = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (warningRef.current) clearTimeout(warningRef.current)
    timerRef.current = null
    warningRef.current = null
  }, [])

  const reset = useCallback(() => {
    if (!enabled || timeoutMs <= 0) return
    clear()
    if (warningMs > 0 && warningMs < timeoutMs) {
      warningRef.current = setTimeout(() => onWarningRef.current?.(), timeoutMs - warningMs)
    }
    timerRef.current = setTimeout(() => onTimeoutRef.current(), timeoutMs)
  }, [enabled, timeoutMs, warningMs, clear])

  useEffect(() => {
    if (!enabled || timeoutMs <= 0) return

    IDLE_EVENTS.forEach((evt) => window.addEventListener(evt, reset, { passive: true }))
    reset()

    return () => {
      IDLE_EVENTS.forEach((evt) => window.removeEventListener(evt, reset))
      clear()
    }
  }, [enabled, timeoutMs, warningMs, reset, clear])

  return { reset }
}