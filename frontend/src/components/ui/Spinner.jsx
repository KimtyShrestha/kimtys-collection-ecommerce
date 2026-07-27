function Spinner({ size = 'md', light = false, className = '' }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-10 w-10 border-[3px]',
  }
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full ${
        light
          ? 'border-white/40 border-t-white'
          : 'border-gray-200 border-t-primary'
      } ${sizes[size]} ${className}`}
    />
  )
}

export default Spinner