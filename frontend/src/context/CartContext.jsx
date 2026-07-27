import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'kc_cart'

// Each item: { id, name, slug, price, discountPrice, imagePath, stock, quantity }
// price fields are snapshots for display; checkout revalidates
// everything server-side (Phase 12), so stale prices can't be exploited.

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)

  // Persist on every change so the cart survives refresh/close.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function addItem(product, quantity = 1) {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id)
      const maxQuantity = Math.max(1, product.stock)
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(maxQuantity, item.quantity + quantity) }
            : item
        )
      }
      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          discountPrice: product.discountPrice ?? null,
          imagePath: product.imagePath ?? null,
          stock: product.stock,
          quantity: Math.min(maxQuantity, quantity),
        },
      ]
    })
  }

  function updateQuantity(id, quantity) {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.min(Math.max(1, item.stock), Math.max(1, quantity)) }
          : item
      )
    )
  }

  function removeItem(id) {
    setItems((current) => current.filter((item) => item.id !== id))
  }

  function clearCart() {
    setItems([])
  }

  const { count, subtotal } = useMemo(() => {
    let count = 0
    let subtotal = 0
    for (const item of items) {
      count += item.quantity
      subtotal += (item.discountPrice ?? item.price) * item.quantity
    }
    return { count, subtotal }
  }, [items])

  return (
    <CartContext.Provider
      value={{ items, count, subtotal, addItem, updateQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used inside a CartProvider')
  }
  return context
}