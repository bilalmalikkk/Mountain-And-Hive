import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/Store'
import { money, prettyDate } from '../lib/format'
import { useTitle } from '../lib/useTitle'

export default function Account() {
  useTitle('Account')
  const { user, orders, login, register, logout } = useStore()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [show, setShow] = useState(false)

  const mine = user ? orders.filter((order) => order.email === user.email) : []

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    if (mode === 'register' && form.name.trim().length < 2) {
      setError('Enter your name')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Enter a valid email')
      return
    }
    if (form.password.length < 8) {
      setError('Use at least 8 characters')
      return
    }
    setBusy(true)
    const result = mode === 'login'
      ? await login({ email: form.email, password: form.password })
      : await register({ name: form.name, email: form.email, password: form.password })
    setBusy(false)
    if (!result.ok) setError(result.error)
  }

  if (user) {
    return (
      <div className="page container account">
        <header className="page-intro">
          <p className="eyebrow">Account</p>
          <h1>Hello, {user.name.split(' ')[0]}.</h1>
          <p className="lede">{user.email}</p>
          <button type="button" className="btn ghost" onClick={logout}>Log out</button>
        </header>
        <h2>Orders</h2>
        {mine.length ? (
          <div className="order-list">
            {mine.map((order) => (
              <Link key={order.id} to={`/order/${order.id}`} className="order-row">
                <span>
                  <strong>{order.id}</strong>
                  <em>{prettyDate(order.createdAt)} · {order.status}</em>
                </span>
                <b>{money(order.total)}</b>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty">
            <h2>No orders yet.</h2>
            <p>When you checkout with this email, the receipt will land here.</p>
            <Link to="/shop" className="btn primary">Shop the harvest</Link>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="page container account">
      <header className="page-intro">
        <p className="eyebrow">Account</p>
        <h1>{mode === 'login' ? 'Welcome back.' : 'Open an account.'}</h1>
        <p className="lede">Accounts live in this browser. There is no server behind the door.</p>
      </header>
      <div className="auth-card">
        <div className="auth-switch">
          <button type="button" className={mode === 'login' ? 'on' : ''} onClick={() => setMode('login')}>Log in</button>
          <button type="button" className={mode === 'register' ? 'on' : ''} onClick={() => setMode('register')}>Register</button>
        </div>
        <form onSubmit={submit}>
          {mode === 'register' ? (
            <label className="field">
              Name
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} autoComplete="name" />
            </label>
          ) : null}
          <label className="field">
            Email
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} autoComplete="email" />
          </label>
          <label className="field">
            Password
            <input
              type={show ? 'text' : 'password'}
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
            <button type="button" className="text-btn" onClick={() => setShow((value) => !value)}>
              {show ? 'Hide password' : 'Show password'}
            </button>
          </label>
          {error ? <p className="notice">{error}</p> : null}
          <button type="submit" className="btn primary full" disabled={busy}>
            {busy ? 'One moment…' : mode === 'login' ? 'Log in' : 'Create account'}
          </button>
          <p className="fine">Passwords are hashed and stored only on this device. Use at least 8 characters.</p>
        </form>
      </div>
    </div>
  )
}
