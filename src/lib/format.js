export function money(n) {
  const value = Math.round(Number(n) || 0)
  return `Rs ${value.toLocaleString('en-US')}`
}

export function prettyDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
