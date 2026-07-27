import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/ui/Spinner'

// Blocks everyone except admins. Customers are sent to the
// homepage, guests to the login page.
function AdminRoute() {
  const { user, initialising } = useAuth()

  if (initialising) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: '/admin' }} replace />
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default AdminRoute