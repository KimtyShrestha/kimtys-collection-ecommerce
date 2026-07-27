import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/ui/Spinner'

// Blocks guests. Remembers where they were going so login
// can send them back afterwards.
function ProtectedRoute() {
  const { user, initialising } = useAuth()
  const location = useLocation()

  if (initialising) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
