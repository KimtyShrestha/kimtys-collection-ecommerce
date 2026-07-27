// Consistent Rs. price formatting everywhere.
// Shows discount price + struck-through original when on sale.
export function formatPrice(value) {
  return `Rs. ${Number(value).toLocaleString('en-IN')}`
}

function PriceDisplay({ price, discountPrice, size = 'md' }) {
  const onSale = discountPrice !== null && discountPrice !== undefined
  const main = onSale ? discountPrice : price

  const mainClasses =
    size === 'lg'
      ? 'text-2xl font-semibold text-gray-900'
      : 'text-base font-semibold text-gray-900'
  const strikeClasses =
    size === 'lg' ? 'text-base text-gray-400' : 'text-sm text-gray-400'

  return (
    <p className="flex flex-wrap items-baseline gap-x-2">
      <span className={mainClasses}>{formatPrice(main)}</span>
      {onSale && (
        <s className={strikeClasses} aria-label={`Original price ${formatPrice(price)}`}>
          {formatPrice(price)}
        </s>
      )}
    </p>
  )
}

export default PriceDisplay