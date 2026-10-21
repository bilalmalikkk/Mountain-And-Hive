import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Summary from '../components/Summary'
import { useStore } from '../context/Store'
import { COUNTRIES, SHIPPING_METHODS, shippingCost } from '../lib/pricing'
import { money } from '../lib/format'
import { useTitle } from '../lib/useTitle'

const empty = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  region: '',
  postal: '',
  country: 'Pakistan',
  notes: '',
  giftNote: '',
  methodId: 'standard',
  payment: 'cod',
  card: '',
  expiry: '',
  cvc: '',
}

export default function Checkout() {
  useTitle('Checkout')
  const { count, user, placeOrder, subtotal } = useStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ ...empty, name: user?.name || '', email: user?.email || '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (form.country !== 'Pakistan' && form.payment === 'cod') {
      setForm((current) => ({ ...current, payment: 'card' }))
    }
  }, [form.country, form.payment])

  if (!count) return <Navigate to="/cart" replace />

  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))

  const onCard = (event) => {
    const digits = event.target.value.replace(/\D/g, '').slice(0, 16)
    const grouped = digits.replace(/(\d{4})(?=\d)/g, '$1 ')
    setForm((current) => ({ ...current, card: grouped }))
  }

  const onExpiry = (event) => {
    const digits = event.target.value.replace(/\D/g, '').slice(0, 4)
    const next = digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
    setForm((current) => ({ ...current, expiry: next }))
  }

  const validate = () => {
    const next = {}
    if (form.name.trim().length < 2) next.name = 'Enter the recipient’s name'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Enter a valid email'
    if (form.phone.trim().length < 7) next.phone = 'Enter a phone number'
    if (form.address.trim().length < 5) next.address = 'Enter a street address'
    if (!form.city.trim()) next.city = 'Enter a city'
    if (!form.postal.trim()) next.postal = 'Enter a postal code'
    if (form.payment === 'cod' && form.country !== 'Pakistan') next.payment = 'Cash on delivery is only available in Pakistan'
    if (form.payment === 'card') {
      const digits = form.card.replace(/\s/g, '')
      if (digits.length < 15) next.card = 'Enter the card number'
      if (!/^\d{2}\/\d{2}$/.test(form.expiry)) next.expiry = 'Use MM/YY'
      if (!/^\d{3,4}$/.test(form.cvc)) next.cvc = 'Enter the CVC'
    }
    return next
  }

  const submit = (event) => {
    event.preventDefault()
    if (sending) return
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length) {
      setFormError('Check the highlighted fields.')
      return
    }
    setSending(true)
    const digits = form.card.replace(/\s/g, '')
    const result = placeOrder({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      region: form.region.trim(),
      postal: form.postal.trim(),
      country: form.country,
      notes: form.notes.trim(),
      giftNote: form.giftNote.trim(),
      methodId: form.methodId,
      methodName: SHIPPING_METHODS.find((method) => method.id === form.methodId)?.name || 'Standard',
      paymentType: form.payment,
      last4: form.payment === 'card' ? digits.slice(-4) : null,
    })
    if (!result.ok) {
      setSending(false)
      setFormError(result.error)
      return
    }
    navigate(`/order/${result.id}`)
  }

  const field = (key, label, props = {}) => {
    const { wide, ...inputProps } = props
    return (
      <label className={`field ${wide ? 'span-2' : ''} ${errors[key] ? 'has-error' : ''}`}>
        {label}
        <input value={form[key]} onChange={set(key)} {...inputProps} />
        {errors[key] ? <small className="err">{errors[key]}</small> : null}
      </label>
    )
  }

  return (
    <div className="page container checkout">
      <header className="page-intro">
        <p className="eyebrow">Checkout</p>
        <h1>Where should we send it?</h1>
        <p className="notice">Demonstration checkout. The order stays in this browser, and no payment is taken.</p>
      </header>
      <form className="checkout-grid" onSubmit={submit} noValidate>
        <div className="checkout-main">
          <section>
            <h2>01 · Contact</h2>
            <div className="form-grid">
              {field('name', 'Full name', { autoComplete: 'name', wide: true })}
              {field('email', 'Email', { type: 'email', autoComplete: 'email' })}
              {field('phone', 'Phone', { type: 'tel', autoComplete: 'tel' })}
            </div>
          </section>
          <section>
            <h2>02 · Delivery</h2>
            <div className="form-grid">
              {field('address', 'Street address', { autoComplete: 'address-line1', wide: true })}
              {field('city', 'City', { autoComplete: 'address-level2' })}
              {field('region', 'Region', { autoComplete: 'address-level1' })}
              {field('postal', 'Postal code', { autoComplete: 'postal-code' })}
              <label className="field">
                Country
                <select value={form.country} onChange={set('country')} autoComplete="country-name">
                  {COUNTRIES.map((country) => <option key={country}>{country}</option>)}
                </select>
              </label>
              <label className="field span-2">
                Delivery note
                <textarea value={form.notes} onChange={set('notes')} rows={2} />
              </label>
              <label className="field span-2">
                Gift note
                <textarea value={form.giftNote} onChange={set('giftNote')} rows={2} placeholder="Written on a card, left under the lid" />
              </label>
            </div>
          </section>
          <section>
            <h2>03 · Shipping</h2>
            <div className="choices">
              {SHIPPING_METHODS.map((method) => {
                const cost = shippingCost(subtotal, method.id, form.country)
                const window = form.country === 'Pakistan' ? method.local : method.abroad
                return (
                  <label key={method.id} className={`choice ${form.methodId === method.id ? 'on' : ''}`}>
                    <input type="radio" name="method" checked={form.methodId === method.id} onChange={() => setForm((current) => ({ ...current, methodId: method.id }))} />
                    <span>
                      <strong>{method.name}</strong>
                      <em>{window}</em>
                    </span>
                    <b>{cost === 0 ? 'Free' : money(cost)}</b>
                  </label>
                )
              })}
            </div>
          </section>
          <section>
            <h2>04 · Payment</h2>
            <div className="choices">
              {form.country === 'Pakistan' ? (
                <label className={`choice ${form.payment === 'cod' ? 'on' : ''}`}>
                  <input type="radio" name="pay" checked={form.payment === 'cod'} onChange={() => setForm((current) => ({ ...current, payment: 'cod' }))} />
                  <span>
                    <strong>Cash on delivery</strong>
                    <em>Pay the rider when the crate arrives.</em>
                  </span>
                </label>
              ) : null}
              <label className={`choice ${form.payment === 'card' ? 'on' : ''}`}>
                <input type="radio" name="pay" checked={form.payment === 'card'} onChange={() => setForm((current) => ({ ...current, payment: 'card' }))} />
                <span>
                  <strong>Card</strong>
                  <em>Demo only. We store the last four digits on the receipt.</em>
                </span>
              </label>
            </div>
            {form.payment === 'card' ? (
              <div className="form-grid card-grid">
                <label className={`field span-2 ${errors.card ? 'has-error' : ''}`}>
                  Card number
                  <input inputMode="numeric" autoComplete="cc-number" value={form.card} onChange={onCard} placeholder="4242 4242 4242 4242" />
                  {errors.card ? <small className="err">{errors.card}</small> : null}
                </label>
                <label className={`field ${errors.expiry ? 'has-error' : ''}`}>
                  Expiry
                  <input inputMode="numeric" autoComplete="cc-exp" value={form.expiry} onChange={onExpiry} placeholder="MM/YY" />
                  {errors.expiry ? <small className="err">{errors.expiry}</small> : null}
                </label>
                <label className={`field ${errors.cvc ? 'has-error' : ''}`}>
                  CVC
                  <input inputMode="numeric" autoComplete="cc-csc" value={form.cvc} onChange={(event) => setForm((current) => ({ ...current, cvc: event.target.value.replace(/\D/g, '').slice(0, 4) }))} placeholder="123" />
                  {errors.cvc ? <small className="err">{errors.cvc}</small> : null}
                </label>
              </div>
            ) : null}
          </section>
          {formError ? <p className="notice">{formError}</p> : null}
          <button type="submit" className="btn primary full" disabled={sending}>
            {sending ? 'Placing order…' : 'Place order'}
          </button>
          <p className="fine">By placing this order you agree to the <Link to="/policies">shipping and privacy notes</Link>.</p>
        </div>
        <aside className="checkout-side">
          <h2>Your bag</h2>
          <Summary variant="checkout" methodId={form.methodId} country={form.country} />
        </aside>
      </form>
    </div>
  )
}
