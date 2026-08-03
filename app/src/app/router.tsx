import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { LoginPage } from '@/features/auth/pages/LoginPage'

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
const UsersPage = lazy(() =>
  import('@/features/users/pages/UsersPage').then((m) => ({ default: m.UsersPage })),
)
const SettingsPage = lazy(() =>
  import('@/features/settings/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
)

function PageLoader() {
  return (
    <div className="flex h-full items-center justify-center py-12" role="status">
      <div className="text-sm text-muted-foreground">Cargando módulo…</div>
    </div>
  )
}

function withSuspense(element: React.ReactElement) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: '/dashboard', element: withSuspense(<DashboardPage />) },
      { path: '/documents', element: withSuspense(<DocumentsPage />) },
      { path: '/documents/:id', element: withSuspense(<DocumentsPage />) },
      { path: '/playground', element: withSuspense(<PlaygroundPage />) },
      { path: '/conversations', element: withSuspense(<ConversationsPage />) },
      { path: '/conversations/:id', element: withSuspense(<ConversationsPage />) },
      { path: '/analytics', element: withSuspense(<AnalyticsPage />) },
      { path: '/audit', element: withSuspense(<AuditPage />) },
      { path: '/users', element: withSuspense(<UsersPage />) },
      { path: '/settings', element: withSuspense(<SettingsPage />) },
    ],
  },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
])