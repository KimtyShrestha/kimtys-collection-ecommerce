import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  LogOut,
  Package,
  HelpCircle,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import SearchBar from './SearchBar'

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop' },
  { to: '/categories', label: 'Categories' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

function navClasses({ isActive }) {
  return `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'text-primary'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
  }`
}

function Header() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef(null)

  // Close menus whenever the route changes.
  useEffect(() => {
    setMobileOpen(false)
    setAccountOpen(false)
  }, [location.pathname])

  // Close the account dropdown when clicking outside it.
  useEffect(() => {
    function onClickOutside(event) {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      {/* Top row: logo, search (desktop), actions */}
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          className="rounded-md p-2 text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Logo */}
        <Link to="/" className="shrink-0 text-xl font-semibold text-primary">
          Kimty's Collection
        </Link>

        {/* Prominent search — desktop (usability finding #1) */}
        <SearchBar className="hidden flex-1 lg:mx-6 lg:block lg:max-w-xl" />

        {/* Actions */}
        <div className="ml-auto flex items-center gap-1">
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <Heart className="h-5 w-5" />
          </Link>

          <Link
            to="/cart"
            aria-label="Shopping cart"
            className="rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>

          {/* Account */}
          {user ? (
            <div ref={accountRef} className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen((open) => !open)}
                aria-label="Account menu"
                aria-expanded={accountOpen}
                className="flex items-center gap-2 rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <User className="h-5 w-5" />
                <span className="hidden max-w-40 truncate text-sm font-medium sm:block">
                  {user.fullName.split(' ')[0]}
                </span>
              </button>

              {accountOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white py-2 shadow-md">
                  <div className="border-b border-gray-200 px-4 pb-2">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {user.fullName}
                    </p>
                    <p className="truncate text-xs text-gray-400">{user.email}</p>
                  </div>
                  <div className="pt-2">
                    <Link
                      to="/account"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                      <User className="h-4 w-4" /> My Account
                    </Link>
                    <Link
                      to="/account/orders"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                      <Package className="h-4 w-4" /> My Orders
                    </Link>
                    <Link
                      to="/help"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                      <HelpCircle className="h-4 w-4" /> Help & FAQ
                    </Link>
                    <button
                      type="button"
                      onClick={logout}
                      className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                      <LogOut className="h-4 w-4" /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              Log In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile search — full-width row (usability findings #1 and #7) */}
      <div className="border-t border-gray-200 px-4 py-2 lg:hidden">
        <SearchBar />
      </div>

      {/* Desktop navigation */}
      <nav
        aria-label="Main navigation"
        className="hidden border-t border-gray-200 lg:block"
      >
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-6 py-1">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={navClasses}>
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Mobile navigation drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-gray-200 bg-white lg:hidden"
        >
          <div className="space-y-1 px-4 py-3">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `block rounded-md px-3 py-3 text-base font-medium ${
                    isActive
                      ? 'bg-primary-light text-primary'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}

export default Header