function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 px-6 py-16 text-center">
      {Icon && <Icon className="h-10 w-10 text-gray-400" aria-hidden="true" />}
      <h3 className="mt-4 text-base font-semibold text-gray-900">{title}</h3>
      {message && (
        <p className="mt-1 max-w-sm text-sm text-gray-600">{message}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export default EmptyState