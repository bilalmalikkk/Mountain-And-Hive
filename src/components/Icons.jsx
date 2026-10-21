export function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 16.5 20 20.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function IconBag() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.5 8.5h11l-.8 11h-9.4l-.8-11Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 8.5V7.2A3 3 0 0 1 12 4a3 3 0 0 1 3 3.2v1.3" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export function IconHeart({ filled = false }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 19.2 5.6 13.1a3.8 3.8 0 0 1 5.2-5.5L12 8.6l1.2-1a3.8 3.8 0 0 1 5.2 5.5L12 19.2Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconUser() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8.2" r="3.1" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5.5 19.2c1.3-2.6 3.5-3.8 6.5-3.8s5.2 1.2 6.5 3.8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function IconMenu() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7.5h16M4 12h16M4 16.5h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function IconClose() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6 18 18M18 6 6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function Mark({ className }) {
  return (
    <svg className={className} viewBox="0 0 36 36" aria-hidden="true">
      <path d="M4 30 13 8l5 9 6-12 8 25" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M18 16.2 21.2 18v3.6L18 23.2 14.8 21.6V18Z" fill="currentColor" />
    </svg>
  )
}
