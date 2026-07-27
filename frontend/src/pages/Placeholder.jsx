import { Hammer } from 'lucide-react'
import EmptyState from '../components/ui/EmptyState'

// Temporary stand-in so no navigation link 404s.
// Each instance is replaced in its own phase.
function Placeholder({ title, phase }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <EmptyState
        icon={Hammer}
        title={title}
        message={`This page is under construction and will be completed in Phase ${phase}.`}
      />
    </div>
  )
}

export default Placeholder