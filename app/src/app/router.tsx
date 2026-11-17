import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ProtectedRoute, type RouteGuard } from '@/components/common/ProtectedRoute'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { NoMembershipPage } from '@/features/auth/pages/NoMembershipPage'
import { TermsPage } from '@/features/landing/pages/TermsPage'

const LandingPage = lazy(() =>
  import('@/features/landing/pages/LandingPage').then((m) => ({ default: m.LandingPage })),
)
const SolicitarAccesoPage = lazy(() =>
  import('@/features/solicitudes/pages/SolicitarAccesoPage').then((m) => ({
    default: m.SolicitarAccesoPage,
  })),
)

const DashboardPage = lazy(() =>
  import('@/features/dashboard/pages/DashboardPage').then((m) => ({
    default: m.DashboardPage,
  })),
)
const DocumentsPage = lazy(() =>
  import('@/features/documents/pages/DocumentsPage').then((m) => ({
    default: m.DocumentsPage,
  })),
)
const PlaygroundPage = lazy(() =>
  import('@/features/chat/pages/PlaygroundPage').then((m) => ({
    default: m.PlaygroundPage,
  })),
)
const ConversationsPage = lazy(() =>
  import('@/features/conversations/pages/ConversationsPage').then((m) => ({
    default: m.ConversationsPage,
  })),
)
const AnalyticsPage = lazy(() =>
  import('@/features/analytics/pages/AnalyticsPage').then((m) => ({
    default: m.AnalyticsPage,
  })),
)
const AuditPage = lazy(() =>
  import('@/features/audit/pages/AuditPage').then((m) => ({ default: m.AuditPage })),
)
const FeedbackPage = lazy(() =>
  import('@/features/feedback/pages/FeedbackPage').then((m) => ({ default: m.FeedbackPage })),
)
const EscalamientosPage = lazy(() =>
  import('@/features/escalamientos/pages/EscalamientosPage').then((m) => ({
    default: m.EscalamientosPage,
  })),
)
const UsersPage = lazy(() =>
  import('@/features/users/pages/UsersPage').then((m) => ({ default: m.UsersPage })),
)
const SettingsPage = lazy(() =>
  import('@/features/settings/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
)
const BillingPage = lazy(() =>
  import('@/features/billing/pages/BillingPage').then((m) => ({ default: m.BillingPage })),
)
const InstitutionPage = lazy(() =>
  import('@/features/institution/pages/InstitutionPage').then((m) => ({
    default: m.InstitutionPage,
  })),
)
const PlatformPage = lazy(() =>
  import('@/features/platform/pages/PlatformPage').then((m) => ({ default: m.PlatformPage })),
)

function PageLoader() {
  return (
    <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 py-12" role="status">
      <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden />
      <span className="text-sm text-muted-foreground">Cargando módulo…</span>
    </div>
  )
}

function withSuspense(element: React.ReactElement) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>
}

function withGuard(element: React.ReactElement, guard: RouteGuard = 'authenticated') {
  return withSuspense(<ProtectedRoute guard={guard}>{element}</ProtectedRoute>)
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<div className="min-h-screen bg-surface-canvas" />}>
        <LandingPage />
      </Suspense>
    ),
  },
  {
    path: '/terminos',
    element: <TermsPage />,
  },
  {
    path: '/solicitar-acceso',
    element: (
      <Suspense fallback={<div className="min-h-screen bg-surface-canvas" />}>
        <SolicitarAccesoPage />
      </Suspense>
    ),
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/sin-membresia',
    element: (
      <ProtectedRoute guard="authenticated">
        <NoMembershipPage />
      </ProtectedRoute>
    ),
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: withGuard(<DashboardPage />, 'member') },
      { path: '/documents', element: withGuard(<DocumentsPage />, 'staff') },
      { path: '/documents/:id', element: withGuard(<DocumentsPage />, 'staff') },
      { path: '/playground', element: withGuard(<PlaygroundPage />, 'staff') },
      { path: '/conversations', element: withGuard(<ConversationsPage />, 'staff') },
      { path: '/conversations/:id', element: withGuard(<ConversationsPage />, 'staff') },
      { path: '/analytics', element: withGuard(<AnalyticsPage />, 'staff') },
      { path: '/audit', element: withGuard(<AuditPage />, 'staff') },
      { path: '/feedback', element: withGuard(<FeedbackPage />, 'admin') },
      { path: '/escalamientos', element: withGuard(<EscalamientosPage />, 'staff') },
      { path: '/users', element: withGuard(<UsersPage />, 'admin') },
      { path: '/settings', element: withGuard(<SettingsPage />, 'admin') },
      { path: '/billing', element: withGuard(<BillingPage />, 'admin') },
      { path: '/institution', element: withGuard(<InstitutionPage />, 'admin') },
      { path: '/platform', element: withGuard(<PlatformPage />, 'platform') },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])