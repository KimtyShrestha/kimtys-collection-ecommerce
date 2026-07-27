import { Link } from 'react-router-dom'
import StaticPage, { PageSection } from '../../components/layout/StaticPage'

export function Shipping() {
  return (
    <StaticPage title="Shipping Information" subtitle="Where, when and how we deliver.">
      <PageSection heading="Delivery Area">
        <p>We currently deliver across Kathmandu Valley, including Kathmandu, Lalitpur and Bhaktapur. Delivery beyond the valley is not yet available, but all products can be purchased at our Banasthali, Basundhara and Hattigauda branches.</p>
      </PageSection>
      <PageSection heading="Delivery Cost">
        <p>Delivery costs Rs. 100 per order. Orders of Rs. 3,000 or more qualify for free delivery, applied automatically at checkout.</p>
      </PageSection>
      <PageSection heading="Delivery Time">
        <p>Orders are typically delivered within 1–3 days. Our team calls the phone number on your order to arrange a convenient time, so please provide a number you answer regularly. A nearby landmark in your address helps our riders find you faster.</p>
      </PageSection>
      <PageSection heading="Order Tracking">
        <p>Track every order from <Link to="/account/orders" className="text-primary hover:underline">My Orders</Link> in your account, where its status updates from Pending through to Delivered.</p>
      </PageSection>
    </StaticPage>
  )
}

export function Returns() {
  return (
    <StaticPage title="Returns & Exchanges" subtitle="Our 7-day exchange promise.">
      <PageSection heading="The Promise">
        <p>If an item isn't right — wrong size, wrong colour, or simply not what you hoped — you can exchange it within 7 days of delivery, provided it is unused, unwashed and in its original condition with tags attached.</p>
      </PageSection>
      <PageSection heading="How to Exchange">
        <p>Bring the item and your order number to any of our three branches, or contact us and we'll arrange an exchange through our delivery team on their next visit to your area.</p>
      </PageSection>
      <PageSection heading="Exceptions">
        <p>For hygiene reasons, innerwear, socks and personalised items (such as name puzzles) cannot be exchanged unless faulty. Faulty items are always replaced or refunded, whatever the category.</p>
      </PageSection>
      <PageSection heading="Refunds">
        <p>Exchanges are our default remedy. Where a replacement isn't possible, Cash on Delivery orders are refunded in cash at a branch, and wallet payments are reversed to the original eSewa or Khalti account.</p>
      </PageSection>
    </StaticPage>
  )
}

export function Privacy() {
  return (
    <StaticPage title="Privacy Policy" subtitle="How we look after your information.">
      <PageSection heading="What We Collect">
        <p>When you create an account or place an order, we collect your name, email address, phone number and delivery addresses. We also keep a record of your orders, wishlist and product reviews so your account works as expected.</p>
      </PageSection>
      <PageSection heading="How We Use It">
        <p>Your information is used only to operate your account, deliver your orders, contact you about them, and improve the shopping experience. We do not sell or share your personal information with third parties for marketing.</p>
      </PageSection>
      <PageSection heading="How We Protect It">
        <p>Passwords are stored using one-way encryption and are never visible to our staff. Access to order information is limited to the team members who need it to serve you.</p>
      </PageSection>
      <PageSection heading="Your Choices">
        <p>You can update your details or addresses at any time from your account, and delete saved addresses or reviews whenever you wish. To close your account entirely, <Link to="/contact" className="text-primary hover:underline">contact us</Link>.</p>
      </PageSection>
      <PageSection heading="About This Platform">
        <p>This website was developed as part of an academic User Experience Design project. Payment methods other than Cash on Delivery are simulated for demonstration purposes, and no live payment processing takes place.</p>
      </PageSection>
    </StaticPage>
  )
}

export function Terms() {
  return (
    <StaticPage title="Terms & Conditions" subtitle="The terms that apply when you shop with us.">
      <PageSection heading="Orders">
        <p>Placing an order is an offer to purchase. We confirm acceptance when we update your order to Confirmed. In the rare case an item becomes unavailable after you order, we'll contact you to arrange a substitute, a wait, or a refund — your choice.</p>
      </PageSection>
      <PageSection heading="Pricing">
        <p>All prices are in Nepalese Rupees (Rs.) and include applicable taxes. Sale prices apply for the period shown. The price at the moment you place your order is the price you pay, recorded permanently on your order.</p>
      </PageSection>
      <PageSection heading="Accounts">
        <p>You are responsible for keeping your password confidential and for activity on your account. Let us know immediately if you believe your account has been accessed without permission.</p>
      </PageSection>
      <PageSection heading="Reviews">
        <p>Reviews should reflect your genuine experience. We moderate reviews before publication and may decline those containing offensive content, personal information, or material unrelated to the product.</p>
      </PageSection>
      <PageSection heading="Exchanges">
        <p>Exchanges are governed by our <Link to="/returns" className="text-primary hover:underline">Returns & Exchanges policy</Link>.</p>
      </PageSection>
    </StaticPage>
  )
}