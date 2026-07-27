function Input({
  label,
  id,
  error,
  helper,
  required = false,
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
      <input
        id={id}
        ref={ref}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={
          error ? `${id}-error` : helper ? `${id}-helper` : undefined
        }
        className={`h-10 w-full rounded-md border bg-white px-3 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
          error
            ? 'border-danger focus:border-danger focus:ring-danger/20'
            : 'border-gray-200 focus:border-primary focus:ring-primary/20'
        }`}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[13px] text-danger">
          {error}
        </p>
      )}
      {!error && helper && (
        <p id={`${id}-helper`} className="mt-1.5 text-[13px] text-gray-400">
          {helper}
        </p>
      )}
    </div>
  )
}

export default Input