import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

const toastStyles = {
  success: { icon: CheckCircle, color: 'text-success' },
  error: { icon: AlertCircle, color: 'text-danger' },
  info: { icon: Info, color: 'text-primary' },
}

let nextId = 1

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const toast = useCallback(
    (message, type = 'success') => {
      const id = nextId++
      setToasts((current) => [...current, { id, message, type }])
      setTimeout(() => dismiss(id), 4000)
    },
    [dismiss]
  )

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2"
        aria-live="polite"
      >
        {toasts.map((item) => {
          const style = toastStyles[item.type] || toastStyles.info
          const Icon = style.icon
          return (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-md"
            >
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${style.color}`} />
              <p className="flex-1 text-sm text-gray-900">{item.message}</p>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                aria-label="Dismiss notification"
                className="rounded p-0.5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used inside a ToastProvider')
  }
  return context
}