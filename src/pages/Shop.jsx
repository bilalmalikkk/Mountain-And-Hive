import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { categories, diets, origins, products } from '../data/catalog'
import { useTitle } from '../lib/useTitle'
import ProductCard from '../components/ProductCard'

const prices = [
  { id: 'under-1000', label: 'Under Rs 1,000' },
  { id: '1000-2500', label: 'Rs 1,000 – 2,500' },
  { id: 'over-2500', label: 'Over Rs 2,500' },
]

function matchesPrice(amount, price) {
  if (price === 'under-1000') return amount < 1000
  if (price === '1000-2500') return amount >= 1000 && amount <= 2500
  if (price === 'over-2500') return amount > 2500
  return true
}

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const [open, setOpen] = useState(false)
  const q = params.get('q')?.trim() || ''
  const cats = (params.get('category') || '').split(',').filter(Boolean)
  const diet = params.get('diet') || ''
  const price = params.get('price') || ''
  const origin = params.get('origin') || ''
  const sort = params.get('sort') || 'featured'
  const sale = params.get('sale') === '1'
  const title = cats.length === 1 ? categories.find((item) => item.id === cats[0])?.name || 'Shop' : 'Shop'
  useTitle(q ? `Search · ${q}` : title)

  const toggle = (key, value) => {
    const next = new URLSearchParams(params)
    if (key === 'category') {
      const set = new Set((next.get(key) || '').split(',').filter(Boolean))
      if (set.has(value)) set.delete(value)
      else set.add(value)
      if (set.size) next.set(key, [...set].join(','))
      else next.delete(key)
    } else if (next.get(key) === value) next.delete(key)
    else next.set(key, value)
    setParams(next)
  }

  const list = products.filter((product) => {
    const amount = product.weights[0].price
    if (cats.length && !cats.includes(product.category)) return false
    if (diet && !product.tags.includes(diet)) return false
    if (origin && product.origin !== origin) return false
    if (sale && !product.weights.some((weight) => weight.compareAt)) return false
    if (!matchesPrice(amount, price)) return false
    if (q) {
      const hay = `${product.name} ${product.origin} ${product.short} ${product.tags.join(' ')} ${product.category}`.toLowerCase()
      if (!hay.includes(q.toLowerCase())) return false
    }
    return true
  })

  const sorted = [...list].sort((a, b) => {
    if (sort === 'price-asc') return a.weights[0].price - b.weights[0].price
    if (sort === 'price-desc') return b.weights[0].price - a.weights[0].price
    if (sort === 'rating') return b.rating - a.rating || b.reviewCount - a.reviewCount
    if (sort === 'name') return a.name.localeCompare(b.name)
    return Number(b.featured) - Number(a.featured) || b.rating - a.rating
  })

  const chips = [
    ...cats.map((id) => ({ key: 'category', value: id, label: categories.find((item) => item.id === id)?.name || id })),
    diet ? { key: 'diet', value: diet, label: diet } : null,
    price ? { key: 'price', value: price, label: prices.find((item) => item.id === price)?.label || price } : null,
    origin ? { key: 'origin', value: origin, label: origin } : null,
    sale ? { key: 'sale', value: '1', label: 'On offer' } : null,
    q ? { key: 'q', value: q, label: `“${q}”` } : null,
  ].filter(Boolean)

  return (
    <div className="page shop">
      <header className="page-intro container">
        <p className="eyebrow">The harvest</p>
        <h1>{q ? `Results for “${q}”` : title === 'Shop' ? 'The full shelf.' : title}</h1>
        <p className="lede">Sixteen lots from the Gilgit room — nuts, dried fruit, raw honey, saffron, and crates.</p>
      </header>
      <div className="container shop-layout">
        <aside className={`filters ${open ? 'open' : ''}`}>
          <div className="filter-head">
            <h2>Filter</h2>
            <button type="button" className="text-btn" onClick={() => setOpen(false)}>Close</button>
          </div>
          <fieldset className="filter-group">
            <legend>Category</legend>
            {categories.map((category) => (
              <label key={category.id} className="check">
                <input type="checkbox" checked={cats.includes(category.id)} onChange={() => toggle('category', category.id)} />
                {category.name}
              </label>
            ))}
          </fieldset>
          <fieldset className="filter-group">
            <legend>Price</legend>
            {prices.map((item) => (
              <label key={item.id} className="check">
                <input type="radio" name="price" checked={price === item.id} onChange={() => toggle('price', item.id)} />
                {item.label}
              </label>
            ))}
          </fieldset>
          <fieldset className="filter-group">
            <legend>Diet & style</legend>
            {diets.map((item) => (
              <label key={item} className="check">
                <input type="radio" name="diet" checked={diet === item} onChange={() => toggle('diet', item)} />
                {item}
              </label>
            ))}
          </fieldset>
          <label className="filter-group">
            Origin
            <select value={origin} onChange={(event) => {
              const next = new URLSearchParams(params)
              if (event.target.value) next.set('origin', event.target.value)
              else next.delete('origin')
              setParams(next)
            }}>
              <option value="">All origins</option>
              {origins.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={sale}
              onChange={() => {
                const next = new URLSearchParams(params)
                if (sale) next.delete('sale')
                else next.set('sale', '1')
                setParams(next)
              }}
            />
            On offer
          </label>
          <button type="button" className="text-btn" onClick={() => setParams({})}>Clear all</button>
        </aside>
        <div>
          <div className="toolbar">
            <button type="button" className="btn small filter-toggle" onClick={() => setOpen(true)}>Filter</button>
            <p>{sorted.length} {sorted.length === 1 ? 'harvest' : 'harvests'}</p>
            <label>
              Sort
              <select value={sort} onChange={(event) => {
                const next = new URLSearchParams(params)
                if (event.target.value === 'featured') next.delete('sort')
                else next.set('sort', event.target.value)
                setParams(next)
              }}>
                <option value="featured">Featured</option>
                <option value="price-asc">Price, low to high</option>
                <option value="price-desc">Price, high to low</option>
                <option value="rating">Rating</option>
                <option value="name">Name</option>
              </select>
            </label>
          </div>
          {chips.length ? (
            <div className="chips">
              {chips.map((chip) => (
                <button type="button" key={`${chip.key}-${chip.value}`} className="chip" onClick={() => toggle(chip.key, chip.value)}>
                  {chip.label} ×
                </button>
              ))}
            </div>
          ) : null}
          {sorted.length ? (
            <div className="grid-products">
              {sorted.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="empty">
              <h2>Nothing in this cut of the shelf.</h2>
              <p>Clear a filter, or look through the full harvest.</p>
              <button type="button" className="btn primary" onClick={() => setParams({})}>Clear filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
