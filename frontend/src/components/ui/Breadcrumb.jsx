import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

// items: [{ to: '/shop', label: 'Shop' }, { label: 'Current Page' }]
// The last item has no `to` and renders as the current page.
function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight className="h-3.5 w-3.5 text-gray-300" aria-hidden="true" />
              )}
              {isLast || !item.to ? (
                <span aria-current="page" className="line-clamp-1 text-gray-900">
                  {item.label}
                </span>
              ) : (
                <Link to={item.to} className="text-gray-600 transition-colors hover:text-primary">
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb