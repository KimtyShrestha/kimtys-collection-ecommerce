import { useForm } from 'react-hook-form'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import StaticPage, { PageSection } from '../../components/layout/StaticPage'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import { useToast } from '../../context/ToastContext'

const BRANCHES = [
  { name: 'Banasthali', phone: '+977-1-4XXXX01' },
  { name: 'Basundhara', phone: '+977-1-4XXXX02' },
  { name: 'Hattigauda', phone: '+977-1-4XXXX03' },
]

function Contact() {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  // Demonstration form: validated fully, acknowledged with a toast.
  // A live deployment would post this to a messages endpoint or email.
  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 500))
    reset()
    toast("Thank you — we've received your message and will reply within one working day.", 'success')
  }

  return (
    <StaticPage
      title="Contact Us"
      subtitle="Questions about a product or an order? We're happy to help."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Details */}
        <div className="space-y-6">
          <PageSection heading="Get in Touch">
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                +977-1-4XXXXXX (head office)
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                hello@kimtyscollection.com
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                Sunday–Friday, 10:00 AM – 7:00 PM
              </li>
            </ul>
          </PageSection>

          <PageSection heading="Our Branches">
            <ul className="space-y-3">
              {BRANCHES.map((branch) => (
                <li key={branch.name} className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>
                    <span className="block text-sm font-medium text-gray-900">{branch.name}, Kathmandu</span>
                    <span className="text-xs text-gray-600">{branch.phone}</span>
                  </span>
                </li>
              ))}
            </ul>
          </PageSection>

          {/* Map */}
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <iframe
              title="Kimty's Collection store locations, Kathmandu"
              src="https://www.openstreetmap.org/export/embed.html?bbox=85.28%2C27.70%2C85.36%2C27.76&layer=mapnik"
              className="h-56 w-full"
              loading="lazy"
            />
          </div>
        </div>

        {/* Form */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Send Us a Message</h2>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-5 space-y-4">
            <Input
              id="contact-name" label="Your Name" required
              error={errors.name?.message}
              {...register('name', { required: 'Your name is required.' })}
            />
            <Input
              id="contact-email" type="email" label="Email Address" required
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required.',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address.' },
              })}
            />
            <Input
              id="contact-subject" label="Subject" required
              placeholder="e.g. Question about order KC-2026-0001"
              error={errors.subject?.message}
              {...register('subject', { required: 'Subject is required.' })}
            />
            <Textarea
              id="contact-message" label="Message" required rows={5}
              error={errors.message?.message}
              {...register('message', {
                required: 'Message is required.',
                minLength: { value: 10, message: 'Please give us a little more detail.' },
              })}
            />
            <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </StaticPage>
  )
}

export default Contact