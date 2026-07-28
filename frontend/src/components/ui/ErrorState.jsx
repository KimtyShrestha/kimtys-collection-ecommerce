import { AlertCircle } from 'lucide-react'
import Button from './Button'

// Consistent inline error with a retry that refetches rather than
// reloading the whole page.
function ErrorState({
  title = 'Something went wrong',
  message = "We couldn't load this right now. Please try again.",
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 px-6 py-16 text-center">
      <AlertCircle className="h-10 w-10 text-gray-400" aria-hidden="true" />
      <h3 className="mt-4 text-base font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-gray-600">{message}</p>
      {onRetry && (
        <div className="mt-6">
          <Button onClick={onRetry}>Try Again</Button>
        </div>
      )}
    </div>
  )
}

export default ErrorState