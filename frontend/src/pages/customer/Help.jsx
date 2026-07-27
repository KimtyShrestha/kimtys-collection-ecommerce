import { Link } from 'react-router-dom'
import {
  HelpCircle, Truck, RotateCcw, ShieldCheck, FileText, Mail, Package,
} from 'lucide-react'
import StaticPage from '../../components/layout/StaticPage'

// Signpost hub (usability finding #10): one obvious place from which
// every help resource is a single click away.
const TOPICS = [
  { to: '/faq', icon: HelpCircle, title: 'FAQ', note: 'Quick answers about ordering, delivery, payment and sizes.' },
  { to: '/shipping', icon: Truck, title: 'Shipping Information', note: 'Delivery areas, costs and timeframes.' },
  { to: '/returns', icon: RotateCcw, title: 'Returns & Exchanges', note: 'Our 7-day exchange promise and how to use it.' },
  { to: '/account/orders', icon: Package, title: 'Track an Order', note: 'See the status of your recent orders.' },
  { to: '/privacy', icon: ShieldCheck, title: 'Privacy Policy', note: 'How we look after your personal information.' },
  { to: '/terms', icon: FileText, title: 'Terms & Conditions', note: 'The terms that apply when you shop with us.' },
  { to: '/contact', icon: Mail, title: 'Contact Us', note: 'Reach our team by phone, email or message.' },
]

function Help() {
  return (
    <StaticPage
      title="Help Centre"
      subtitle="Everything you need to shop with confidence, in one place."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {TOPICS.map((topic) => (
          <Link
            key={topic.to}
            to={topic.to}
            className="group flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-primary-border hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light">
              <topic.icon className="h-5 w-5 text-primary" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-gray-900 group-hover:text-primary">
                {topic.title}
              </span>
              <span className="mt-0.5 block text-xs text-gray-600">{topic.note}</span>
            </span>
          </Link>
        ))}
      </div>
    </StaticPage>
  )
}

export default Help