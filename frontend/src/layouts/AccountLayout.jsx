import { NavLink, Outlet } from 'react-router-dom'
import { User, Package, Heart, MapPin, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// One place for everything account-related (usability finding #6).
const ACCOUNT_LINKS = [
  { to: '/account', label: 'Profile', icon: User, end: true },
  { to: '/account/orders', label: 'My Orders', icon: Package },
  { to: '/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/account/addresses', label: 'Addresses', icon: MapPin },
  { to: '/account/settings', label: 'Settings', icon: Settings },
]

function AccountLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">My Account</h1>
      <p className="mt-1 text-sm text-gray-600">
        Welcome back, {user?.fullName?.split(' ')[0]}
      </p>

      <div className="mt-6 lg:grid lg:grid-cols-[220px_1fr] lg:gap-8">
        {/* Sidebar (desktop) / horizontal scroll tabs (mobile) */}
        <nav aria-label="Account navigation" className="lg:sticky lg:top-36 lg:h-fit">
          <ul className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {ACCOUNT_LINKS.map((link) => (
              <li key={link.to} className="shrink-0">
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-light text-primary'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <link.icon className="h-4 w-4" aria-hidden="true" />
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li className="shrink-0">
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Log Out
              </button>
            </li>
          </ul>
        </nav>

        <div className="mt-4 min-w-0 lg:mt-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AccountLayout