export const FREE_SHIPPING = 8000
export const TAX_RATE = 0.05

export const PROMOS = {
  HONEY10: { code: 'HONEY10', type: 'percent', value: 10, label: '10% off' },
  SUMMIT20: {
    code: 'SUMMIT20',
    type: 'percent',
    value: 20,
    min: 8000,
    label: '20% off orders over Rs 8,000',
  },
  WELCOME15: { code: 'WELCOME15', type: 'percent', value: 15, label: '15% welcome offer' },
  HIVE500: {
    code: 'HIVE500',
    type: 'fixed',
    value: 500,
    min: 3000,
    label: 'Rs 500 off orders over Rs 3,000',
  },
}

export const COUNTRIES = [
  'Pakistan',
  'United Arab Emirates',
  'Saudi Arabia',
  'United Kingdom',
  'United States',
  'Canada',
  'Germany',
]

export const SHIPPING_METHODS = [
  { id: 'standard', name: 'Standard', local: '3–6 business days', abroad: '7–14 business days' },
  { id: 'express', name: 'Express', local: '1–3 business days in major cities', abroad: '4–7 business days' },
]

export function weightOf(product, weightId) {
  return product.weights.find((w) => w.id === weightId) || product.weights[0]
}

export function discountFor(subtotal, promo) {
  if (!promo) return 0
  if (promo.min && subtotal < promo.min) return 0
  if (promo.type === 'percent') return Math.round((subtotal * promo.value) / 100)
  return Math.min(promo.value, subtotal)
}

export function shippingCost(subtotal, methodId = 'standard', country = 'Pakistan') {
  const international = country !== 'Pakistan'
  if (methodId === 'express') return international ? 2800 : 750
  if (international) return subtotal >= 20000 ? 0 : 1600
  return subtotal >= FREE_SHIPPING ? 0 : 350
}

export function quote({ subtotal, promo, methodId = 'standard', country = 'Pakistan' }) {
  const discount = discountFor(subtotal, promo)
  const merchandise = Math.max(0, subtotal - discount)
  const shipping = shippingCost(subtotal, methodId, country)
  const tax = Math.round(merchandise * TAX_RATE)
  const total = merchandise + shipping + tax
  return { discount, merchandise, shipping, tax, total }
}
