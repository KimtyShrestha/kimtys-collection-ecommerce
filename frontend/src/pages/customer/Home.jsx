import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Baby,
  Shirt,
  Footprints,
  Backpack,
  ToyBrick,
  Glasses,
  Snowflake,
  Gift,
  Truck,
  ShieldCheck,
  Store,
  Quote,
} from 'lucide-react'
import { fetchCategories } from '../../services/productService'
import Button from '../../components/ui/Button'
import ProductSection from '../../components/product/ProductSection'
import { useToast } from '../../context/ToastContext'
import { usePageTitle } from '../../hooks/usePageTitle'
import collage1 from '../../assets/collage/floral-summer-dress-girls.jpg'
import collage2 from '../../assets/collage/wooden-building-blocks-60.jpg'
import collage3 from '../../assets/collage/light-up-sneakers.jpg'
import collage4 from '../../assets/collage/newborn-cotton-bodysuit-5-pack.jpg'
import collage5 from '../../assets/collage/ergonomic-school-backpack.jpg'
import collage6 from '../../assets/collage/soft-plush-elephant-40cm.jpg'

// Icon per category slug — one consistent outline set (Lucide).
const CATEGORY_ICONS = {
  'baby-clothing': Baby,
  girls: Shirt,
  boys: Shirt,
  footwear: Footprints,
  'school-accessories': Backpack,
  toys: ToyBrick,
  accessories: Glasses,
  'seasonal-items': Snowflake,
  'gift-items': Gift,
}
const COLLAGE = [collage1, collage2, collage3, collage4, collage5, collage6]

const AGE_GROUPS = [
  { value: '0-2', label: '0–2 years', note: 'Babies & toddlers' },
  { value: '3-5', label: '3–5 years', note: 'Preschool' },
  { value: '6-9', label: '6–9 years', note: 'Primary school' },
  { value: '10-14', label: '10–14 years', note: 'Older kids' },
]

const TESTIMONIALS = [
  {
    quote:
      'Shopping for my two kids used to mean a whole afternoon at the store. Now I order their school things in minutes.',
    name: 'Kalpana S.',
    detail: 'Parent, Basundhara',
  },
  {
    quote:
      'The sizes and age suggestions are clear, so gifts for my niece always fit. Delivery to my office was quick too.',
    name: 'Melisha A.',
    detail: 'Gift buyer, Kathmandu',
  },
  {
    quote:
      "I've bought from their Banasthali shop for years. Ordering online with cash on delivery feels just as trustworthy.",
    name: 'Kumar S.',
    detail: 'Parent, Banasthali',
  },
]

function Home() {
  usePageTitle('')
  const [categories, setCategories] = useState([])
  const { toast } = useToast()
  const [newsletterEmail, setNewsletterEmail] = useState('')

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  function onNewsletterSubmit(event) {
    event.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
      toast('Please enter a valid email address.', 'error')
      return
    }
    setNewsletterEmail('')
    toast('Thank you for subscribing to our newsletter.', 'success')
  }

  return (
    <div>
      {/* ============ Hero ============ */}
      <section className="relative overflow-hidden bg-primary-light">
        {/* Collage layer */}
        <div
          aria-hidden="true"
          className="absolute inset-0 grid grid-cols-2 grid-rows-3 sm:grid-cols-3 sm:grid-rows-2 lg:grid-cols-6 lg:grid-rows-1"
        >
          {COLLAGE.map((image, index) => (
            <img
              key={index}
              src={image}
              alt=""
              className="h-full w-full object-cover"
            />
          ))}
        </div>

        <div aria-hidden="true" className="absolute inset-0 bg-white/25" />

        {/* Content */}
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="max-w-2xl rounded-2xl bg-white/80 p-8 shadow-sm backdrop-blur-sm sm:p-10">
            <p className="text-sm font-medium text-primary">
              Trusted by Kathmandu families for 18+ years
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-gray-900 sm:text-5xl">
              Everything your little ones need, in one place
            </h1>
            <p className="mt-4 max-w-lg text-gray-600">
              Quality clothing, toys, school essentials and gifts for children —
              now available online with delivery across Kathmandu Valley.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop">
                <Button size="lg">Shop Now</Button>
              </Link>
              <Link to="/categories">
                <Button size="lg" variant="outline">
                  Browse Categories
                </Button>
              </Link>
            </div>
          </div>

          {/* Trust points */}
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Truck, title: 'Valley-wide delivery', note: 'To your door in 1–3 days' },
              { icon: ShieldCheck, title: 'Cash on Delivery', note: 'Pay when your order arrives' },
              { icon: Store, title: '3 physical stores', note: 'Banasthali · Basundhara · Hattigauda' },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-lg border border-white/60 bg-white/90 p-4 shadow-sm backdrop-blur-sm"
              >
                <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  <p className="mt-0.5 text-xs text-gray-600">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Categories ============ */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <h2 className="text-2xl font-semibold text-gray-900">Shop by Category</h2>
          <p className="mt-1 text-sm text-gray-600">
            Find exactly what you're looking for
          </p>
          <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-9">
            {categories.map((category) => {
              const Icon = CATEGORY_ICONS[category.slug] || Gift
              return (
                <Link
                  key={category.id}
                  to={`/shop?category=${category.slug}`}
                  className="group flex flex-col items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 text-center transition-all hover:border-primary-border hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light transition-colors group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-5 w-5 text-primary group-hover:text-white" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-medium leading-tight text-gray-900">
                    {category.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* ============ Featured ============ */}
      <ProductSection
        title="Featured Products"
        subtitle="Hand-picked favourites from our collection"
        params={{ featured: 'true' }}
        viewAllTo="/shop?filter=featured"
      />

      {/* ============ Shop by Age ============ */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <h2 className="text-2xl font-semibold text-gray-900">Shop by Age</h2>
          <p className="mt-1 text-sm text-gray-600">
            The right fit for every stage
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {AGE_GROUPS.map((age) => (
              <Link
                key={age.value}
                to={`/shop?age=${age.value}`}
                className="rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-primary-border hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <p className="text-lg font-semibold text-gray-900">{age.label}</p>
                <p className="mt-1 text-sm text-gray-600">{age.note}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ New Arrivals ============ */}
      <ProductSection
        title="New Arrivals"
        subtitle="Just added to the collection"
        params={{ newArrival: 'true' }}
        viewAllTo="/shop?filter=new"
      />

      {/* ============ Promo banner ============ */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 rounded-xl bg-primary px-6 py-10 sm:flex-row sm:items-center sm:px-10">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Winter essentials are here
            </h2>
            <p className="mt-2 max-w-md text-sm text-white/80">
              Jackets, thermals and woollens to keep them warm all season — with
              savings on selected items.
            </p>
          </div>
          <Link to="/shop?filter=sale" className="shrink-0">
            <Button
              size="lg"
              variant="secondary"
              className="border-transparent"
            >
              Shop the Sale
            </Button>
          </Link>
        </div>
      </section>

      {/* ============ Popular ============ */}
      <ProductSection
        title="Popular Right Now"
        subtitle="What other parents are buying"
        params={{ popular: 'true' }}
        viewAllTo="/shop?filter=popular"
      />

      {/* ============ Testimonials ============ */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            What Our Customers Say
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((item) => (
              <figure
                key={item.name}
                className="rounded-lg border border-gray-200 bg-white p-6"
              >
                <Quote className="h-5 w-5 text-primary" aria-hidden="true" />
                <blockquote className="mt-3 text-sm text-gray-600">
                  "{item.quote}"
                </blockquote>
                <figcaption className="mt-4">
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.detail}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Newsletter ============ */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Stay in the loop</h2>
          <p className="mt-2 text-sm text-gray-600">
            New arrivals, seasonal offers and parenting tips — straight to your
            inbox.
          </p>
          <form
            onSubmit={onNewsletterSubmit}
            className="mt-6 flex flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={newsletterEmail}
              onChange={(event) => setNewsletterEmail(event.target.value)}
              placeholder="you@example.com"
              className="h-12 flex-1 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <Button type="submit" size="lg">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default Home