import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail } from 'lucide-react'

const SHOP_LINKS = [
  { to: '/shop', label: 'All Products' },
  { to: '/categories', label: 'Categories' },
  { to: '/shop?filter=new', label: 'New Arrivals' },
  { to: '/shop?filter=sale', label: 'Sale' },
]

const HELP_LINKS = [
  { to: '/help', label: 'Help Centre' },
  { to: '/faq', label: 'FAQ' },
  { to: '/shipping', label: 'Shipping Information' },
  { to: '/returns', label: 'Returns Policy' },
]

const COMPANY_LINKS = [
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms & Conditions' },
]

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="text-sm text-gray-600 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand + contact */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-lg font-semibold text-primary">Kimty's Collection</p>
            <p className="mt-3 max-w-xs text-sm text-gray-600">
              Quality children's clothing, toys and essentials — trusted by
              Kathmandu families for over 18 years.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
                Banasthali · Basundhara · Hattigauda
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
                +977-1-4XXXXXX
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
                hello@kimtyscollection.com
              </li>
            </ul>
          </div>

          <FooterColumn title="Shop" links={SHOP_LINKS} />
          <FooterColumn title="Help" links={HELP_LINKS} />
          <FooterColumn title="Company" links={COMPANY_LINKS} />
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6">
          <p className="text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Kimty's Collection. All prices in
            Nepalese Rupees (Rs.). This platform was developed as part of an
            academic UX project.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer