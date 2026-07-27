import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import CustomerLayout from './layouts/CustomerLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import AdminRoute from './routes/AdminRoute'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import DesignSystem from './pages/DesignSystem'
import Placeholder from './pages/Placeholder'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Auth pages — standalone, no header/footer */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/design-system" element={<DesignSystem />} />

            {/* Customer pages — share the CustomerLayout shell */}
            <Route element={<CustomerLayout />}>
              {/* Public */}
              <Route path="/" element={<Placeholder title="Homepage" phase="8" />} />
              <Route path="/shop" element={<Placeholder title="Shop" phase="9" />} />
              <Route path="/categories" element={<Placeholder title="Categories" phase="9" />} />
              <Route path="/search" element={<Placeholder title="Search Results" phase="9" />} />
              <Route path="/product/:slug" element={<Placeholder title="Product Details" phase="10" />} />
              <Route path="/cart" element={<Placeholder title="Shopping Cart" phase="11" />} />
              <Route path="/about" element={<Placeholder title="About Us" phase="15" />} />
              <Route path="/contact" element={<Placeholder title="Contact" phase="15" />} />
              <Route path="/faq" element={<Placeholder title="FAQ" phase="15" />} />
              <Route path="/help" element={<Placeholder title="Help Centre" phase="15" />} />
              <Route path="/shipping" element={<Placeholder title="Shipping Information" phase="15" />} />
              <Route path="/returns" element={<Placeholder title="Returns Policy" phase="15" />} />
              <Route path="/privacy" element={<Placeholder title="Privacy Policy" phase="15" />} />
              <Route path="/terms" element={<Placeholder title="Terms & Conditions" phase="15" />} />

              {/* Logged-in customers only */}
              <Route element={<ProtectedRoute />}>
                <Route path="/checkout" element={<Placeholder title="Checkout" phase="12" />} />
                <Route path="/account" element={<Placeholder title="My Account" phase="13" />} />
                <Route path="/account/orders" element={<Placeholder title="My Orders" phase="13" />} />
                <Route path="/wishlist" element={<Placeholder title="Wishlist" phase="13" />} />
              </Route>

              {/* 404 inside the customer shell */}
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin — separate shell arrives in Phase 16 */}
            <Route element={<AdminRoute />}>
              <Route
                path="/admin"
                element={<Placeholder title="Admin Dashboard" phase="16" />}
              />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App