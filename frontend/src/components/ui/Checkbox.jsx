function Checkbox({ label, id, className = '', ref, ...props }) {
  return (
    <label
      htmlFor={id}
      className={`inline-flex cursor-pointer select-none items-center gap-2 ${className}`}
    >
      <input
        type="checkbox"
        id={id}
        ref={ref}
        className="h-4 w-4 rounded border-gray-300 accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        {...props}
      />
      <span className="text-sm text-gray-600">{label}</span>
    </label>
  )
}

export default Checkbox