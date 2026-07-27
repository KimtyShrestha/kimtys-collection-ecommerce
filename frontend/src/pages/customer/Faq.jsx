import { Link } from 'react-router-dom'
import StaticPage, { PageSection } from '../../components/layout/StaticPage'
import Accordion from '../../components/ui/Accordion'

const ORDERING = [
  {
    question: 'How do I place an order?',
    answer: 'Browse or search for products, add them to your cart, and proceed to checkout. You\'ll need a free account so we can keep you updated and show your order history.',
  },
  {
    question: 'Do I need an account to shop?',
    answer: 'You can browse freely without one, but an account is required at checkout — it lets you track orders, save addresses, and keep a wishlist.',
  },
  {
    question: 'Can I change or cancel my order?',
    answer: 'Contact us as soon as possible — if your order hasn\'t been dispatched yet, we can usually change or cancel it. Once shipped, our 7-day exchange policy applies instead.',
  },
]

const DELIVERY = [
  {
    question: 'How much does delivery cost?',
    answer: 'Delivery within Kathmandu Valley is Rs. 100, and free for orders of Rs. 3,000 or more.',
  },
  {
    question: 'How long does delivery take?',
    answer: 'Typically 1–3 days within Kathmandu Valley. We\'ll call the number on your order to arrange a convenient time.',
  },
  {
    question: 'Do you deliver outside Kathmandu Valley?',
    answer: 'Not yet — currently we deliver within the valley only. You\'re always welcome at any of our three branches.',
  },
]

const PAYMENT = [
  {
    question: 'What payment methods do you accept?',
    answer: 'Cash on Delivery, eSewa and Khalti. Most customers choose Cash on Delivery — you pay only when your order arrives.',
  },
  {
    question: 'Is it safe to order online from you?',
    answer: 'Yes. We\'ve served Kathmandu families in person for over 18 years, and every online order is handled by the same store team. With Cash on Delivery, you don\'t pay a rupee until the order is in your hands.',
  },
]

const PRODUCTS = [
  {
    question: 'How do I choose the right size or age group?',
    answer: 'Every product lists its age suitability, and clothing shows available sizes. If you\'re between sizes, we suggest sizing up — children grow fast! Still unsure? Message us and we\'ll advise.',
  },
  {
    question: 'What if an item doesn\'t fit or isn\'t right?',
    answer: 'Unused items in original condition can be exchanged within 7 days at any branch or via our delivery team. See our Returns Policy for details.',
  },
]

function Faq() {
  return (
    <StaticPage
      title="Frequently Asked Questions"
      subtitle="Quick answers to the questions we hear most."
    >
      <PageSection heading="Ordering"><Accordion items={ORDERING} /></PageSection>
      <PageSection heading="Delivery"><Accordion items={DELIVERY} /></PageSection>
      <PageSection heading="Payment"><Accordion items={PAYMENT} /></PageSection>
      <PageSection heading="Products, Sizes & Exchanges"><Accordion items={PRODUCTS} /></PageSection>

      <div className="rounded-lg bg-primary-light p-5 text-center text-sm text-gray-600">
        Didn't find your answer? Visit our{' '}
        <Link to="/help" className="font-medium text-primary hover:underline">Help Centre</Link>{' '}
        or{' '}
        <Link to="/contact" className="font-medium text-primary hover:underline">contact us</Link>{' '}
        directly.
      </div>
    </StaticPage>
  )
}

export default Faq