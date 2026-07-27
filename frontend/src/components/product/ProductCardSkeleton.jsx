// Loading placeholder matching ProductCard's shape — prevents layout shift.
function ProductCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="aspect-square bg-gray-100" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-1/3 rounded bg-gray-100" />
        <div className="h-4 w-full rounded bg-gray-100" />
        <div className="h-4 w-1/2 rounded bg-gray-100" />
      </div>
    </div>
  )
}

export default ProductCardSkeleton