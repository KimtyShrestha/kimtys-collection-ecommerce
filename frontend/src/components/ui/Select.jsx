import { ChevronDown } from 'lucide-react'

function Select({
  label,
  id,
  error,
  required = false,
  options = [],
  placeholder,
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
      <div className="relative">
        <select
          id={id}
          ref={ref}
          aria-invalid={error ? 'true' : undefined}
          className={`h-10 w-full appearance-none rounded-md border bg-white px-3 pr-9 text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 ${
            error
              ? 'border-danger focus:border-danger focus:ring-danger/20'
              : 'border-gray-200 focus:border-primary focus:ring-primary/20'
          }`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
      {error && (
        <p className="mt-1.5 text-[13px] text-danger">{error}</p>
      )}
    </div>
  )
}

export default Select