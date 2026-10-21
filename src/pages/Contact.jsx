import { useState } from 'react'
import { useTitle } from '../lib/useTitle'

export default function Contact() {
  useTitle('Contact')
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', topic: 'Order', message: '' })
  const [error, setError] = useState('')

  const submit = (event) => {
    event.preventDefault()
    if (form.name.trim().length < 2) return setError('Enter your name')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Enter a valid email')
    if (form.message.trim().length < 12) return setError('Tell us a little more')
    const notes = JSON.parse(localStorage.getItem('mh_mail') || '[]')
    notes.unshift({ ...form, at: new Date().toISOString() })
    localStorage.setItem('mh_mail', JSON.stringify(notes.slice(0, 20)))
    setSent(true)
  }

  return (
    <div className="page container contact-grid">
      <header className="page-intro">
        <p className="eyebrow">Contact</p>
        <h1>Write to the packing room.</h1>
        <p className="lede">Orders, wholesale, and the odd question about a jar that has set hard.</p>
        <div className="contact-card">
          <p><b>Harvest Room</b><br />Skardu Road<br />Gilgit, Gilgit-Baltistan</p>
          <p><a href="mailto:hello@mountainandhives.com">hello@mountainandhives.com</a><br />+92 5811 000 214</p>
          <p>Monday to Saturday<br />10:00–18:00 PKT</p>
        </div>
      </header>
      {sent ? (
        <div className="empty">
          <h2>Received.</h2>
          <p>This note is saved in your browser. In a live shop it would reach the room the same day.</p>
        </div>
      ) : (
        <form className="auth-card" onSubmit={submit}>
          <label className="field">
            Name
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </label>
          <label className="field">
            Email
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </label>
          <label className="field">
            Topic
            <select value={form.topic} onChange={(event) => setForm({ ...form, topic: event.target.value })}>
              <option>Order</option>
              <option>Wholesale</option>
              <option>Press</option>
              <option>Something else</option>
            </select>
          </label>
          <label className="field">
            Message
            <textarea rows={5} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
          </label>
          {error ? <p className="notice">{error}</p> : null}
          <button type="submit" className="btn primary">Send the note</button>
        </form>
      )}
    </div>
  )
}
