import { Component } from 'react'

// Class component required — React has no hook equivalent for
// componentDidCatch. Wraps the app so a crash shows a recovery screen
// instead of a blank page.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // Logged for developers; never shown to the customer.
    console.error('Application error:', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
        <svg
          className="h-12 w-12 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4" strokeLinecap="round" />
          <path d="M12 16h.01" strokeLinecap="round" />
        </svg>

        <h1 className="mt-6 text-2xl font-semibold text-gray-900">
          Something went wrong
        </h1>

        <p className="mt-2 max-w-md text-gray-600">
          We're sorry — an unexpected problem occurred. Reloading the page
          usually fixes it.
        </p>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex h-10 items-center rounded-lg bg-primary px-5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            Reload Page
          </button>

          <a
            href="/"
            className="inline-flex h-10 items-center rounded-lg border border-gray-200 bg-white px-5 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
          >
            Back to Home
          </a>
        </div>
      </div>
    )
  }
}

export default ErrorBoundary