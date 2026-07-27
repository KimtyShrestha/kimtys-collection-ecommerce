import { Link } from 'react-router-dom'
import { Store, Heart, ShieldCheck, Truck } from 'lucide-react'
import StaticPage, { PageSection } from '../../components/layout/StaticPage'
import Button from '../../components/ui/Button'

const BRANCHES = [
  { name: 'Banasthali', note: 'Our original store, open since the beginning.' },
  { name: 'Basundhara', note: 'Our largest branch, with the full toy range.' },
  { name: 'Hattigauda', note: 'Our newest branch, serving the northern valley.' },
]

const VALUES = [
  { icon: Heart, title: 'Family first', note: 'We stock what we would happily give our own children.' },
  { icon: ShieldCheck, title: 'Trust', note: 'Honest pricing, genuine products and a 7-day exchange promise.' },
  { icon: Truck, title: 'Convenience', note: 'Shop online or in store — whichever suits your day.' },
]

function About() {
  return (
    <StaticPage
      title="About Kimty's Collection"
      subtitle="Serving Kathmandu's families for over 18 years."
    >
      <PageSection heading="Our Story">
        <p>
          Kimty's Collection began over 18 years ago as a small children's shop
          in Banasthali. Word travelled the way it does in Kathmandu — from one
          parent to another — and today we serve families across the valley from
          three branches, stocking everything from newborn essentials to school
          gear for teenagers.
        </p>
        <p>
          For most of that time, shopping with us meant visiting a store or
          messaging us on Facebook. This website is our next step: the same
          products, the same people, and the same care — now available from
          your home, with delivery across Kathmandu Valley.
        </p>
      </PageSection>

      <PageSection heading="Our Mission">
        <p>
          To make quality children's products easy to find, honestly priced and
          convenient to buy — so parents spend less time shopping and more time
          with their children.
        </p>
      </PageSection>

      <PageSection heading="What We Stand For">
        <div className="grid gap-4 sm:grid-cols-3">
          {VALUES.map((value) => (
            <div key={value.title} className="rounded-lg border border-gray-200 bg-white p-4">
              <value.icon className="h-5 w-5 text-primary" aria-hidden="true" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">{value.title}</h3>
              <p className="mt-1 text-xs text-gray-600">{value.note}</p>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection heading="Our Stores">
        <div className="grid gap-4 sm:grid-cols-3">
          {BRANCHES.map((branch) => (
            <div key={branch.name} className="rounded-lg border border-gray-200 bg-white p-4">
              <Store className="h-5 w-5 text-primary" aria-hidden="true" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">{branch.name}</h3>
              <p className="mt-1 text-xs text-gray-600">{branch.note}</p>
            </div>
          ))}
        </div>
        <p>
          Every online order is packed by the same team you would meet in store.
          Prefer to see something in person? Visit any branch — details on our{' '}
          <Link to="/contact" className="text-primary hover:underline">contact page</Link>.
        </p>
      </PageSection>

      <div className="rounded-xl bg-primary-light p-6 text-center">
        <h2 className="text-lg font-semibold text-gray-900">Ready to browse?</h2>
        <p className="mt-1 text-sm text-gray-600">
          Everything your little ones need, delivered in 1–3 days.
        </p>
        <Link to="/shop" className="mt-4 inline-block">
          <Button>Shop Now</Button>
        </Link>
      </div>
    </StaticPage>
  )
}

export default About