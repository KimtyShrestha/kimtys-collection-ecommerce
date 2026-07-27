function Textarea({
  label,
  id,
  error,
  required = false,
  rows = 4,
  className = '',
  ref,
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-gray-900"
        >
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <textarea
        id={id}
        ref={ref}
        rows={rows}
        aria-invalid={error ? 'true' : undefined}
        className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
          error
            ? 'border-danger focus:border-danger focus:ring-danger/20'
            : 'border-gray-200 focus:border-primary focus:ring-primary/20'
        }`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-[13px] text-danger">{error}</p>
      )}
    </div>
  )
}

export default Textarea