import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './routes/ProtectedRoute'
import AdminRoute from './routes/AdminRoute'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import DesignSystem from './pages/DesignSystem'
import Button from './components/ui/Button'

// Temporary homepage — replaced by the real layout in Phase 7.
function TempHome() {
  const { user, logout } = useAuth()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-semibold text-gray-900">Kimty's Collection</h1>
      {user ? (
        <>
          <p className="text-gray-600">
            Logged in as <span className="font-medium text-gray-900">{user.fullName}</span> ({user.role})
          </p>
          <Button variant="secondary" onClick={logout}>Log Out</Button>
        </>
      ) : (
        <>
          <p className="text-gray-600">You are browsing as a guest.</p>
          <div className="flex gap-3">
            <Link to="/login"><Button>Log In</Button></Link>
            <Link to="/register"><Button variant="outline">Create Account</Button></Link>
          </div>
        </>
      )}
      <p className="mt-4 text-sm text-gray-400">
        Temporary page — the real homepage arrives in Phase 8.
      </p>
    </div>
  )
}

// Temporary protected pages to prove the guards work.
function TempAccount() {
  return <div className="p-10 text-gray-900">Account area (customers only) — real version in Phase 13.</div>
}
function TempAdmin() {
  return <div className="p-10 text-gray-900">Admin dashboard (admins only) — real version in Phase 16.</div>
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<TempHome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/design-system" element={<DesignSystem />} />

            {/* Customers (and admins) — must be logged in */}
            <Route element={<ProtectedRoute />}>
              <Route path="/account" element={<TempAccount />} />
            </Route>

            {/* Admins only */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<TempAdmin />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App