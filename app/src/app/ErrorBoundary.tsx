import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ErrorState } from '@/components/feedback/ErrorState'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Error no capturado en render:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-[50vh] items-center justify-center p-6">
          <ErrorState
            message={
              this.state.error?.message
                ? `Ocurrió un error inesperado: ${this.state.error.message}`
                : 'Ocurrió un error inesperado al renderizar la vista.'
            }
            onRetry={this.handleReset}
            retryLabel="Recargar página"
          />
        </div>
      )
    }

    return this.props.children
  }
}
