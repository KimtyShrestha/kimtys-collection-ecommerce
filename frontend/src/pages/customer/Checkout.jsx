import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
  Banknote,
  Smartphone,
  ShieldCheck,
  ImageIcon,
  AlertCircle,
} from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { apiPlaceOrder } from '../../services/orderService'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { formatPrice } from '../../components/product/PriceDisplay'

const API_ORIGIN = import.meta.env.VITE_API_URL.replace(/\/api$/, '')
const FREE_DELIVERY_ABOVE = 3000
const DELIVERY_FEE = 100

const PAYMENT_METHODS = [
  {
    value: 'cod',
    label: 'Cash on Delivery',
    note: 'Pay in cash when your order arrives',
    icon: Banknote,
  },
  {
    value: 'esewa',
    label: 'eSewa',
    note: 'Pay with your eSewa wallet',
    icon: Smartphone,
  },
  {
    value: 'khalti',
    label: 'Khalti',
    note: 'Pay with your Khalti wallet',
    icon: Smartphone,
  },
]

function Checkout() {
  const { items, count, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')
  const [stockProblem, setStockProblem] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.fullName || '',
      phone: user?.phone || '',
      city: 'Kathmandu',
      area: '',
      street: '',
      landmark: '',
      paymentMethod: 'cod',
    },
  })

  const paymentMethod = watch('paymentMethod')
  const deliveryFee = subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE
  const total = subtotal + deliveryFee

  // An empty cart has nothing to check out.
  if (items.length === 0) {
    return <Navigate to="/cart" replace />
  }

  async function onSubmit(values) {
    setServerError('')
    setStockProblem(false)
    try {
      const order = await apiPlaceOrder({
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        paymentMethod: values.paymentMethod,
        shipping: {
          name: values.name,
          phone: values.phone,
          city: values.city,
          area: values.area,
          street: values.street || undefined,
          landmark: values.landmark || undefined,
        },
      })
      clearCart()
      toast('Order placed successfully.', 'success')
      navigate(`/order-confirmation/${order.orderNumber}`, { replace: true })
    } catch (error) {
      setServerError(error.message)
      // Stock/availability problems are fixed in the cart, not here.
      if (error.message.includes('stock') || error.message.includes('no longer available')) {
        setStockProblem(true)
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">Checkout</h1>
      <p className="mt-1 text-sm text-gray-600">
        Almost there — confirm your details and place your order
      </p>

      {serverError && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-3 rounded-md border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <div>
            {serverError}
            {stockProblem && (
              <Link to="/cart" className="ml-1 font-medium underline">
                Review your cart
              </Link>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            {/* ===== 1. Shipping ===== */}
            <section className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-base font-semibold text-gray-900">
                1. Shipping Details
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Input
                  id="name"
                  label="Recipient Name"
                  required
                  autoComplete="name"
                  error={errors.name?.message}
                  {...register('name', { required: 'Recipient name is required.' })}
                />
                <Input
                  id="phone"
                  type="tel"
                  label="Phone Number"
                  required
                  placeholder="98XXXXXXXX"
                  autoComplete="tel"
                  helper="For delivery updates."
                  error={errors.phone?.message}
                  {...register('phone', { required: 'Phone number is required.' })}
                />
                <Input
                  id="city"
                  label="City"
                  required
                  error={errors.city?.message}
                  {...register('city', { required: 'City is required.' })}
                />
                <Input
                  id="area"
                  label="Area"
                  required
                  placeholder="e.g. Basundhara"
                  error={errors.area?.message}
                  {...register('area', { required: 'Area is required.' })}
                />
                <Input
                  id="street"
                  label="Street"
                  placeholder="Optional"
                  error={errors.street?.message}
                  {...register('street')}
                />
                <Input
                  id="landmark"
                  label="Landmark"
                  placeholder="e.g. Near ABC School"
                  helper="Helps our rider find you faster."
                  error={errors.landmark?.message}
                  {...register('landmark')}
                />
              </div>
            </section>

            {/* ===== 2. Payment ===== */}
            <section className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-base font-semibold text-gray-900">
                2. Payment Method
              </h2>
              <div className="mt-4 space-y-3">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                      paymentMethod === method.value
                        ? 'border-primary bg-primary-light'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      value={method.value}
                      className="mt-1 h-4 w-4 accent-primary"
                      {...register('paymentMethod')}
                    />
                    <method.icon
                      className={`mt-0.5 h-5 w-5 ${
                        paymentMethod === method.value ? 'text-primary' : 'text-gray-400'
                      }`}
                      aria-hidden="true"
                    />
                    <span>
                      <span className="block text-sm font-medium text-gray-900">
                        {method.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-gray-600">
                        {method.note}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
              {paymentMethod !== 'cod' && (
                <p className="mt-3 rounded-md bg-warning-light px-3 py-2 text-xs text-warning">
                  Demonstration mode: online payment is simulated for this
                  academic project — no real payment will be taken. Your order
                  will be treated as payable on delivery.
                </p>
              )}
            </section>
          </div>

          {/* ===== Order Summary — always visible (finding #9) ===== */}
          <aside className="h-fit rounded-lg border border-gray-200 bg-white p-6 lg:sticky lg:top-36">
            <h2 className="text-base font-semibold text-gray-900">Order Summary</h2>

            <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
              {items.map((item) => {
                const unitPrice = item.discountPrice ?? item.price
                return (
                  <li key={item.id} className="flex items-center gap-3">
                    <span className="relative block h-12 w-12 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                      {item.imagePath ? (
                        <img
                          src={`${API_ORIGIN}${item.imagePath}`}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center">
                          <ImageIcon className="h-5 w-5 text-gray-300" aria-hidden="true" />
                        </span>
                      )}
                      <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gray-900 px-1 text-[10px] font-semibold text-white">
                        {item.quantity}
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-1 text-sm text-gray-900">{item.name}</span>
                      <span className="text-xs text-gray-400">
                        {formatPrice(unitPrice)} each
                      </span>
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatPrice(unitPrice * item.quantity)}
                    </span>
                  </li>
                )
              })}
            </ul>

            <dl className="mt-4 space-y-2 border-t border-gray-200 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">Subtotal ({count} {count === 1 ? 'item' : 'items'})</dt>
                <dd className="font-medium text-gray-900">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Delivery</dt>
                <dd className="font-medium text-gray-900">
                  {deliveryFee === 0 ? <span className="text-success">Free</span> : formatPrice(deliveryFee)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 text-base">
                <dt className="font-semibold text-gray-900">Total</dt>
                <dd className="font-semibold text-gray-900">{formatPrice(total)}</dd>
              </div>
            </dl>

            <Button
              type="submit"
              size="lg"
              loading={isSubmitting}
              className="mt-5 w-full"
            >
              Place Order · {formatPrice(total)}
            </Button>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-400">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Your details are used only for this delivery
            </p>

            <Link to="/cart" className="mt-2 block text-center text-sm text-gray-600 hover:text-primary">
              Back to cart
            </Link>
          </aside>
        </div>
      </form>
    </div>
  )
}

export default Checkout