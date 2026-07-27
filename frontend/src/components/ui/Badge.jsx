const styles = {
  primary: 'bg-primary-light text-primary',
  neutral: 'bg-gray-100 text-gray-600',
  success: 'bg-success-light text-success',
  warning: 'bg-warning-light text-warning',
  danger: 'bg-danger-light text-danger',
}

function Badge({ variant = 'neutral', className = '', children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

export default Badge