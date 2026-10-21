import { useState } from 'react'

export function Photo({ image, alt = '', eager = false }) {
  const src = typeof image === 'string' ? image : image?.src
  const fit = typeof image === 'string' ? 'center' : image?.fit || 'center'
  const label = alt || (typeof image === 'string' ? '' : image?.alt) || ''
  const [failedSrc, setFailedSrc] = useState('')
  const failed = Boolean(src) && failedSrc === src

  if (!src || failed) return <span className="ph" role="img" aria-label={label} />

  return (
    <img
      src={src}
      alt={label}
      style={{ objectPosition: fit }}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailedSrc(src)}
    />
  )
}

export function Stars({ value }) {
  const full = Math.round(value)
  return (
    <span className="stars" aria-label={`${value} out of 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <svg key={index} viewBox="0 0 20 20" className={index < full ? 'on' : ''}>
          <path d="m10 1.8 2.4 5.4 5.8.5-4.4 3.9 1.3 5.7L10 14.4 4.9 17.3 6.2 11.6 1.8 7.7l5.8-.5Z" />
        </svg>
      ))}
    </span>
  )
}

export function Qty({ value, onChange, min = 1, max = 99 }) {
  return (
    <div className="qty">
      <button type="button" onClick={() => onChange(value - 1)} aria-label="Decrease quantity" disabled={value <= min}>
        −
      </button>
      <span>{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} aria-label="Increase quantity" disabled={value >= max}>
        +
      </button>
    </div>
  )
}

export function Accord({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={`accord ${open ? 'open' : ''}`}>
      <button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <span>{title}</span>
        <i aria-hidden="true">{open ? '–' : '+'}</i>
      </button>
      {open ? <div className="accord-body">{children}</div> : null}
    </div>
  )
}
