import { useState } from 'react'
import { PackageOpen } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Textarea from '../components/ui/Textarea'
import Checkbox from '../components/ui/Checkbox'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import { useToast } from '../context/ToastContext'

function Section({ title, children }) {
  return (
    <section className="mb-12">
      <h2 className="mb-6 text-2xl font-semibold text-gray-900">{title}</h2>
      {children}
    </section>
  )
}

function Swatch({ name, className }) {
  return (
    <div className="text-center">
      <div className={`h-16 w-full rounded-lg border border-gray-200 ${className}`} />
      <p className="mt-2 text-xs text-gray-600">{name}</p>
    </div>
  )
}

function DesignSystem() {
  const [modalOpen, setModalOpen] = useState(false)
  const { toast } = useToast()

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-semibold text-gray-900">
        Kimty's Collection — Design System
      </h1>
      <p className="mt-2 mb-12 text-gray-600">
        Reference page for design tokens and reusable UI components. Internal
        use only — removed before final screenshots.
      </p>

      <Section title="Colours">
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          <Swatch name="Primary" className="bg-primary" />
          <Swatch name="Primary Light" className="bg-primary-light" />
          <Swatch name="Surface" className="bg-gray-50" />
          <Swatch name="Success" className="bg-success" />
          <Swatch name="Warning" className="bg-warning" />
          <Swatch name="Danger" className="bg-danger" />
        </div>
      </Section>

      <Section title="Typography">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-gray-900">Heading 1 — 30px</h1>
          <h2 className="text-2xl font-semibold text-gray-900">Heading 2 — 24px</h2>
          <h3 className="text-lg font-semibold text-gray-900">Heading 3 — 18px</h3>
          <p className="text-base text-gray-600">
            Body text — 16px. Quality children's clothing for every season.
          </p>
          <p className="text-sm text-gray-600">Small — 14px</p>
          <p className="text-xs text-gray-400">Caption — 12px</p>
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
      </Section>

      <Section title="Form Fields">
        <div className="grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
          <Input
            id="ds-name"
            label="Full Name"
            required
            placeholder="e.g. Sita Sharma"
            helper="As it appears on your delivery."
          />
          <Input
            id="ds-email"
            label="Email Address"
            required
            defaultValue="not-an-email"
            error="Please enter a valid email address."
          />
          <Select
            id="ds-age"
            label="Age Group"
            placeholder="Select an age group"
            options={[
              { value: '0-2', label: '0–2 years' },
              { value: '3-5', label: '3–5 years' },
              { value: '6-9', label: '6–9 years' },
            ]}
          />
          <Textarea
            id="ds-message"
            label="Message"
            placeholder="Write your message here…"
            className="sm:col-span-2"
          />
          <Checkbox id="ds-remember" label="Remember me" defaultChecked />
        </div>
      </Section>

      <Section title="Badges & Status">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="primary">New Arrival</Badge>
          <Badge variant="neutral">Default</Badge>
          <Badge variant="success">In Stock</Badge>
          <Badge variant="warning">Low Stock</Badge>
          <Badge variant="danger">Sale</Badge>
        </div>
      </Section>

      <Section title="Loaders">
        <div className="flex items-center gap-6">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
      </Section>

      <Section title="Feedback">
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => toast('Product added to cart.', 'success')}>
            Success Toast
          </Button>
          <Button
            variant="secondary"
            onClick={() => toast('Network connection lost.', 'error')}
          >
            Error Toast
          </Button>
          <Button variant="outline" onClick={() => setModalOpen(true)}>
            Open Modal
          </Button>
        </div>
      </Section>

      <Section title="Empty State">
        <EmptyState
          icon={PackageOpen}
          title="Your cart is empty"
          message="Browse our collection to find something your little one will love."
          action={<Button>Continue Shopping</Button>}
        />
      </Section>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Remove item?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setModalOpen(false)
                toast('Item removed.', 'success')
              }}
            >
              Remove
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          This item will be removed from your cart. You can add it again at any
          time.
        </p>
      </Modal>
    </div>
  )
}

export default DesignSystem