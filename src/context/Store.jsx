import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { getProduct, products } from '../data/catalog'
import { hashPassword } from '../lib/auth'
import { PROMOS, quote, weightOf } from '../lib/pricing'

const StoreContext = createContext(null)
const KEYS = {
  cart: 'mh_cart',
  wish: 'mh_wish',
  user: 'mh_user',
  users: 'mh_users',
  orders: 'mh_orders',
  stock: 'mh_stock',
}

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function sanitizeCart(lines) {
  if (!Array.isArray(lines)) return []
  return lines.filter((line) => {
    const product = getProduct(line?.productId)
    return product && weightOf(product, line.weightId)
  })
}

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => sanitizeCart(load(KEYS.cart, [])))
  const [wish, setWish] = useState(() => {
    const saved = load(KEYS.wish, [])
    return Array.isArray(saved) ? saved.filter((id) => getProduct(id)) : []
  })
  const [user, setUser] = useState(() => load(KEYS.user, null))
  const [orders, setOrders] = useState(() => load(KEYS.orders, []))
  const [sold, setSold] = useState(() => load(KEYS.stock, {}))
  const [promo, setPromo] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [toasts, setToasts] = useState([])
  const toastId = useRef(1)

  useEffect(() => localStorage.setItem(KEYS.cart, JSON.stringify(cart)), [cart])
  useEffect(() => localStorage.setItem(KEYS.wish, JSON.stringify(wish)), [wish])
  useEffect(() => localStorage.setItem(KEYS.orders, JSON.stringify(orders)), [orders])
  useEffect(() => localStorage.setItem(KEYS.stock, JSON.stringify(sold)), [sold])
  useEffect(() => {
    if (user) localStorage.setItem(KEYS.user, JSON.stringify(user))
    else localStorage.removeItem(KEYS.user)
  }, [user])

  const pushToast = (message, tone = 'ok') => {
    const id = toastId.current++
    setToasts((current) => [...current, { id, message, tone }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 3200)
  }

  const dismissToast = (id) => setToasts((current) => current.filter((toast) => toast.id !== id))

  const stockOf = (product) => {
    if (!product) return 0
    return Math.max(0, product.stock - (sold[product.id] || 0))
  }

  const lines = useMemo(
    () =>
      cart
        .map((line) => {
          const product = getProduct(line.productId)
          if (!product) return null
          const weight = weightOf(product, line.weightId)
          return {
            ...line,
            product,
            weight,
            unit: weight.price,
            total: weight.price * line.qty,
          }
        })
        .filter(Boolean),
    [cart],
  )

  const count = lines.reduce((sum, line) => sum + line.qty, 0)
  const subtotal = lines.reduce((sum, line) => sum + line.total, 0)

  const addToCart = (productId, weightId, qty = 1, { open = false } = {}) => {
    const product = getProduct(productId)
    if (!product) return
    const available = stockOf(product)
    if (available <= 0) {
      pushToast(`${product.name} is resting until the next harvest`, 'err')
      return
    }
    const weight = weightOf(product, weightId)
    const lineId = `${product.id}:${weight.id}`
    const existing = cart.find((line) => line.lineId === lineId)
    const current = existing?.qty || 0
    if (current >= available) {
      pushToast(`Only ${available} available`, 'err')
      return
    }
    const nextQty = Math.min(available, current + qty)
    setCart((prev) => {
      const found = prev.find((line) => line.lineId === lineId)
      if (found) return prev.map((line) => (line.lineId === lineId ? { ...line, qty: nextQty } : line))
      return [...prev, { lineId, productId: product.id, weightId: weight.id, qty: nextQty }]
    })
    pushToast(`${product.name} added to your bag`)
    if (open) setCartOpen(true)
  }

  const setQty = (lineId, qty) => {
    setCart((prev) => {
      if (qty <= 0) return prev.filter((line) => line.lineId !== lineId)
      return prev.map((line) => {
        if (line.lineId !== lineId) return line
        const product = getProduct(line.productId)
        const max = stockOf(product)
        return { ...line, qty: Math.max(1, Math.min(max, qty)) }
      })
    })
  }

  const removeLine = (lineId) => setCart((prev) => prev.filter((line) => line.lineId !== lineId))
  const clearCart = () => setCart([])

  const toggleWish = (id) => {
    const has = wish.includes(id)
    setWish((prev) => (has ? prev.filter((item) => item !== id) : [...prev, id]))
    const product = getProduct(id)
    pushToast(has ? 'Removed from wishlist' : `${product?.name || 'Saved'} saved to wishlist`)
  }

  const inWish = (id) => wish.includes(id)

  const applyPromo = (code) => {
    const key = code.trim().toUpperCase()
    const found = PROMOS[key]
    if (!found) {
      pushToast('That code is not active', 'err')
      return false
    }
    if (found.min && subtotal < found.min) {
      pushToast(`${key} needs a bag of Rs ${found.min.toLocaleString('en-US')}`, 'err')
      return false
    }
    setPromo(found)
    pushToast(`${key} applied`)
    return true
  }

  const clearPromo = () => setPromo(null)

  const register = async ({ name, email, password }) => {
    const clean = email.trim().toLowerCase()
    const users = load(KEYS.users, [])
    if (users.some((record) => record.email === clean)) {
      return { ok: false, error: 'An account with that email already exists' }
    }
    const passwordHash = await hashPassword(password)
    const record = { name: name.trim(), email: clean, passwordHash }
    localStorage.setItem(KEYS.users, JSON.stringify([...users, record]))
    setUser({ name: record.name, email: record.email })
    return { ok: true }
  }

  const login = async ({ email, password }) => {
    const clean = email.trim().toLowerCase()
    const users = load(KEYS.users, [])
    const found = users.find((record) => record.email === clean)
    if (!found) return { ok: false, error: 'No account found for that email' }
    const passwordHash = await hashPassword(password)
    if (found.passwordHash !== passwordHash) return { ok: false, error: 'That password does not match' }
    setUser({ name: found.name, email: found.email })
    return { ok: true }
  }

  const logout = () => setUser(null)

  const placeOrder = (info) => {
    if (!lines.length) return { ok: false, error: 'Your bag is empty' }
    for (const line of lines) {
      const available = stockOf(line.product)
      if (line.qty > available) {
        return { ok: false, error: `${line.product.name} has only ${available} left` }
      }
    }
    const totals = quote({
      subtotal,
      promo,
      methodId: info.methodId,
      country: info.country,
    })
    let id = `MH-${Math.floor(10000 + Math.random() * 90000)}`
    while (orders.some((order) => order.id === id)) {
      id = `MH-${Math.floor(10000 + Math.random() * 90000)}`
    }
    const order = {
      id,
      createdAt: new Date().toISOString(),
      status: 'Packing',
      ...info,
      items: lines.map((line) => ({
        productId: line.productId,
        name: line.product.name,
        image: line.product.images[0],
        weight: line.weight.label,
        qty: line.qty,
        unit: line.unit,
        total: line.total,
      })),
      subtotal,
      discount: totals.discount,
      promoCode: totals.discount ? promo?.code || null : null,
      shipping: totals.shipping,
      tax: totals.tax,
      total: totals.total,
    }
    setOrders((prev) => [order, ...prev])
    setSold((prev) => {
      const next = { ...prev }
      for (const line of lines) next[line.productId] = (next[line.productId] || 0) + line.qty
      return next
    })
    setCart([])
    setPromo(null)
    setCartOpen(false)
    return { ok: true, id }
  }

  const subscribe = (email) => {
    const clean = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      return { ok: false, error: 'Enter a valid email' }
    }
    const list = load('mh_news', [])
    if (!list.includes(clean)) localStorage.setItem('mh_news', JSON.stringify([...list, clean]))
    return { ok: true }
  }

  const value = {
    products,
    cart: lines,
    count,
    subtotal,
    promo,
    wish,
    user,
    orders,
    toasts,
    cartOpen,
    setCartOpen,
    addToCart,
    setQty,
    removeLine,
    clearCart,
    toggleWish,
    inWish,
    applyPromo,
    clearPromo,
    register,
    login,
    logout,
    placeOrder,
    stockOf,
    pushToast,
    dismissToast,
    subscribe,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const value = useContext(StoreContext)
  if (!value) throw new Error('useStore must be used within StoreProvider')
  return value
}
