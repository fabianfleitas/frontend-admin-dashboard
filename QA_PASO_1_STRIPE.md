# QA Paso 1 — Stripe Integration (backend corriendo 200)

Estado: verificado que `GET /health` = 200. Endpoints Stripe requieren JWT de Supabase Auth (no anon key).

## Secuencia de prueba manual (con sesión de admin institucional)

1. Login como admin institucional (`/login`) → obtener JWT en `supabase.auth.getSession()` (el frontend lo envía en `Authorization: Bearer <jwt>` automáticamente via `lib/http.ts`).
2. En Billing (`/billing`):
   - Si plan no tiene `stripe_price_id`: pulsar **Sincronizar plan con Stripe** (`POST /api/admin/stripe/sync-plan` con `plan_id`).
   - Pulsar **Pagar / Suscribirse** → redirige a `CheckoutSessionOut.url` (Stripe Checkout hosted).
3. En Stripe test: usar tarjeta `4242 4242 4242 4242` → completar → webhook `checkout.session.completed` activa `pagos` / `suscripciones`.
4. Volver a `/billing?stripe=success`: el `useEffect` muestra toast de éxito; `useStripeSubscription` debe mostrar `status=active`; `pagosQuery` debe mostrar pago nuevo; `stripeHistory` debe mostrar evento.
5. **Cancelar** → confirmar en modal (`cancel_at_period_end: true`) → `SubscriptionActionOut` actualizado.
6. **Reactivar** → `reactivate-subscription` → status vuelve a `active`.
7. **Portal** → `portal-session` → redirect a Stripe Billing Portal.

## Datos verificados de contrato (openapi.current.json 2026-08-26)
- `POST /api/admin/stripe/checkout` → `CheckoutSessionOut`
- `GET /api/admin/stripe/subscription` → `StripeSubscriptionOut`
- `POST /api/admin/stripe/cancel-subscription` → `SubscriptionActionOut`
- `POST /api/admin/stripe/reactivate-subscription` → `SubscriptionActionOut`
- `POST /api/admin/stripe/sync-plan` → `StripePlanSyncOut`
- `GET /api/admin/subscription/history` → paginado `SubscriptionHistoryOut`
- Webhook `POST /api/billing/stripe/webhook` requiere `Stripe-Signature`

## Comandos utiles (local dev backend)
```bash
stripe listen --forward-to localhost:8000/api/billing/stripe/webhook
# .env backend: STRIPE_WEBHOOK_SECRET=whsec_...
```

Nota: el frontend ya envía `Authorization: Bearer <jwt>` y resuelve `institucion_id`/`tipo_miembro` desde el JWT; no usa headers `X-*` delegados.
