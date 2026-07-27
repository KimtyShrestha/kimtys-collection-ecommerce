import Spinner from './Spinner'

const variants = {
  primary:
    'bg-primary text-white hover:bg-primary-hover focus-visible:ring-primary/40',
  secondary:
    'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 focus-visible:ring-gray-300',
  outline:
    'bg-white text-primary border border-primary hover:bg-primary-light focus-visible:ring-primary/40',
  ghost:
    'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-300',
  danger:
    'bg-danger text-white hover:bg-red-700 focus-visible:ring-danger/40',
}

const sizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
}

function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <Spinner size="sm" light={variant === 'primary' || variant === 'danger'} />
      )}
      {children}
    </button>
  )
}

export default Button