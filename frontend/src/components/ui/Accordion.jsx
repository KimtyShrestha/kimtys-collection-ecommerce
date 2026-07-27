import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

// Accessible accordion: buttons with aria-expanded, one open at a time.
function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
      {items.map((item, index) => {
        const open = openIndex === index
        return (
          <div key={index}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : index)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40"
            >
              <span className="text-sm font-medium text-gray-900">{item.question}</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>
            {open && (
              <div className="px-5 pb-4 text-sm leading-relaxed text-gray-600">
                {item.answer}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default Accordion