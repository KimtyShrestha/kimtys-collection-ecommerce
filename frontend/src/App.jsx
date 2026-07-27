import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import CustomerLayout from './layouts/CustomerLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import AdminRoute from './routes/AdminRoute'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import DesignSystem from './pages/DesignSystem'
import NotFound from './pages/NotFound'
import Home from './pages/customer/Home'
import Shop from './pages/customer/Shop'
import Categories from './pages/customer/Categories'
import ProductDetails from './pages/customer/ProductDetails'
import Cart from './pages/customer/Cart'
import Checkout from './pages/customer/Checkout'
import OrderConfirmation from './pages/customer/OrderConfirmation'
import AccountLayout from './layouts/AccountLayout'
import Profile from './pages/account/Profile'
import Settings from './pages/account/Settings'
import Addresses from './pages/account/Addresses'
import OrderHistory from './pages/account/OrderHistory'
import OrderDetails from './pages/account/OrderDetails'
import Wishlist from './pages/customer/Wishlist'
import ForgotPassword from './pages/auth/ForgotPassword'
import About from './pages/customer/About'
import Contact from './pages/customer/Contact'
import Faq from './pages/customer/Faq'
import Help from './pages/customer/Help'
import { Shipping, Returns, Privacy, Terms } from './pages/customer/Policies'
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminProductForm from './pages/admin/AdminProductForm'
import AdminCategories from './pages/admin/AdminCategories'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <Routes>
              {/* Auth pages — standalone, no header/footer */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/design-system" element={<DesignSystem />} />

              {/* Customer pages — share the CustomerLayout shell */}
              <Route element={<CustomerLayout />}>
                {/* Public */}
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/search" element={<Shop isSearch />} />
                <Route path="/product/:slug" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/help" element={<Help />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/returns" element={<Returns />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />

                {/* Logged-in customers only */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
                  <Route path="/account" element={<AccountLayout />}>
                  <Route index element={<Profile />} />
                  <Route path="orders" element={<OrderHistory />} />
                  <Route path="orders/:orderNumber" element={<OrderDetails />} />
                  <Route path="addresses" element={<Addresses />} />
                  <Route path="settings" element={<Settings />} />
                  </Route>
                  <Route path="/wishlist" element={<Wishlist />} />
                </Route>

                {/* 404 inside the customer shell */}
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Admin — own shell, role-guarded */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/new" element={<AdminProductForm />} />
                <Route path="products/:id/edit" element={<AdminProductForm />} />
                <Route path="categories" element={<AdminCategories />} />

            </Route>
            </Routes>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App