import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Star,
  Menu,
  X,
  Store,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'

const ADMIN_LINKS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
]

function SidebarLinks({ onNavigate }) {
  return (
    <ul className="space-y-1">
      {ADMIN_LINKS.map((link) => (
        <li key={link.to}>
          <NavLink
            to={link.to}
            end={link.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <link.icon className="h-4 w-4" aria-hidden="true" />
            {link.label}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}

function AdminLayout() {
  const { user, logout } = useAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)
  useBodyScrollLock(drawerOpen)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link to="/admin" className="text-lg font-semibold text-primary">
            Kimty's Collection
            <span className="ml-2 rounded bg-primary-light px-2 py-0.5 text-xs font-medium text-primary">
              Admin
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/"
              className="hidden items-center gap-1.5 rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 sm:flex"
            >
              <Store className="h-4 w-4" aria-hidden="true" /> View Store
            </Link>
            <span className="hidden text-sm text-gray-600 md:block">{user?.fullName}</span>
            <button
              type="button"
              onClick={logout}
              aria-label="Log out"
              className="rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px]">
        {/* Sidebar (desktop) */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-56 shrink-0 border-r border-gray-200 bg-white p-4 lg:block">
          <SidebarLinks />
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      {/* Sidebar drawer (mobile) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
          <div className="absolute inset-0 bg-gray-900/50" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
          <nav className="absolute inset-y-0 left-0 w-64 bg-white p-4 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">Menu</span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarLinks onNavigate={() => setDrawerOpen(false)} />
          </nav>
        </div>
      )}
    </div>
  )
}

export default AdminLayout