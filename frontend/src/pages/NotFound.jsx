import { Link } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import Button from '../components/ui/Button'

function NotFound() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <SearchX className="h-12 w-12 text-gray-400" aria-hidden="true" />
      <h1 className="mt-6 text-3xl font-semibold text-gray-900">Page not found</h1>
      <p className="mt-2 max-w-md text-gray-600">
        The page you're looking for doesn't exist or may have moved. Let's get
        you back to shopping.
      </p>
      <div className="mt-8 flex gap-3">
        <Link to="/"><Button>Back to Home</Button></Link>
        <Link to="/shop"><Button variant="outline">Browse Products</Button></Link>
      </div>
    </div>
  )
}

export default NotFound