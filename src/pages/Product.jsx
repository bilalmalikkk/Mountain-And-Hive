import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCategory, getProduct, relatedProducts } from '../data/catalog'
import { useStore } from '../context/Store'
import { money } from '../lib/format'
import { useTitle } from '../lib/useTitle'
import { IconHeart } from '../components/Icons'
import ProductCard from '../components/ProductCard'
import { Accord, Photo, Qty, Stars } from '../components/ui'

export default function Product() {
  const { id } = useParams()
  const product = getProduct(id)
  const { addToCart, toggleWish, inWish, stockOf } = useStore()
  const [active, setActive] = useState(0)
  const [weightId, setWeightId] = useState(product?.weights[0].id)
  const [qty, setQty] = useState(1)
  const [recent, setRecent] = useState([])

  useTitle(product?.name || 'Harvest')

  useEffect(() => {
    if (!product) return
    setActive(0)
    setWeightId(product.weights[0].id)
    setQty(1)
    const prev = JSON.parse(localStorage.getItem('mh_recent') || '[]')
    setRecent(prev.filter((item) => item !== product.id).map(getProduct).filter(Boolean).slice(0, 4))
    const next = [product.id, ...prev.filter((item) => item !== product.id)].slice(0, 8)
    localStorage.setItem('mh_recent', JSON.stringify(next))
  }, [product])

  if (!product) {
    return (
      <div className="page container empty">
        <h1>That tin is not on the shelf.</h1>
        <Link to="/shop" className="btn primary">Back to the harvest</Link>
      </div>
    )
  }

  const category = getCategory(product.category)
  const weight = product.weights.find((item) => item.id === weightId) || product.weights[0]
  const stock = stockOf(product)
  const wished = inWish(product.id)
  const related = relatedProducts(product)

  return (
    <div className="page">
      <article className="container pdp">
        <div className="pdp-gallery">
          <div className="frame pdp-main">
            <Photo image={product.images[active] || product.images[0]} alt={product.name} eager />
          </div>
          {product.images.length > 1 ? (
            <div className="thumbs">
              {product.images.map((image, index) => (
                <button type="button" key={image.src} className={index === active ? 'on' : ''} onClick={() => setActive(index)}>
                  <span className="frame"><Photo image={image} alt="" /></span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div className="pdp-info">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to={`/shop?category=${product.category}`}>{category?.name}</Link>
            <span>/</span>
            <span aria-current="page">{product.name}</span>
          </nav>
          <p className="eyebrow">{product.origin}</p>
          <h1>{product.name}</h1>
          <p className="card-meta">
            <Stars value={product.rating} />
            <span>{product.rating} · {product.reviewCount} notes</span>
          </p>
          <p className="price large">
            {weight.compareAt ? <s className="was">{money(weight.compareAt)}</s> : null}
            <strong>{money(weight.price)}</strong>
          </p>
          <p className="lede">{product.description}</p>
          <p className="lot">Lot {product.lot} · {product.altitude}</p>
          {stock > 0 && stock <= 8 ? <p className="low">Only {stock} left in this lot</p> : null}
          {stock < 1 ? <p className="low">Resting until the next harvest</p> : null}
          <div className="weights" role="radiogroup" aria-label="Size">
            {product.weights.map((item) => (
              <button
                type="button"
                key={item.id}
                className={item.id === weight.id ? 'on' : ''}
                onClick={() => setWeightId(item.id)}
              >
                <b>{item.label}</b>
                <span>{money(item.price)}</span>
              </button>
            ))}
          </div>
          <div className="buy-row">
            <Qty value={qty} max={Math.max(1, stock)} onChange={setQty} />
            <button
              type="button"
              className="btn primary"
              disabled={stock < 1}
              onClick={() => addToCart(product.id, weight.id, qty, { open: true })}
            >
              {stock < 1 ? 'Resting this season' : 'Add to bag'}
            </button>
            <button
              type="button"
              className={`icon-btn wish-lg ${wished ? 'on' : ''}`}
              aria-pressed={wished}
              aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
              onClick={() => toggleWish(product.id)}
            >
              <IconHeart filled={wished} />
            </button>
          </div>
          <ul className="tag-row">
            {product.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
          <div className="accord-list">
            <Accord title="Tasting & origin" defaultOpen>
              <p>{product.tasting}</p>
              <p>Serve it {product.pairs.charAt(0).toLowerCase() + product.pairs.slice(1)}</p>
              <p>Origin: {product.origin}.</p>
            </Accord>
            <Accord title="Ingredients & allergens">
              <p>{product.ingredients}</p>
              <p>{product.allergens}</p>
            </Accord>
            <Accord title="Nutrition">
              <p className="fine">Typical values per {product.nutrition.serving}.</p>
              <dl className="nutrition">
                <div><dt>Energy</dt><dd>{product.nutrition.calories}</dd></div>
                <div><dt>Fat</dt><dd>{product.nutrition.fat}</dd></div>
                <div><dt>Carbs</dt><dd>{product.nutrition.carbs}</dd></div>
                <div><dt>Protein</dt><dd>{product.nutrition.protein}</dd></div>
                <div><dt>Fibre</dt><dd>{product.nutrition.fiber}</dd></div>
              </dl>
            </Accord>
            <Accord title="Keeping & shipping">
              <p>{product.storage}</p>
              <p>Complimentary shipping across Pakistan on orders over Rs 8,000. Glass is packed to travel.</p>
            </Accord>
          </div>
        </div>
      </article>

      <section className="section container">
        <div className="section-head"><h2>Notes</h2></div>
        <div className="review-list">
          {product.reviews.map((item) => (
            <article key={item.title} className="review">
              <Stars value={item.rating} />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <p className="fine">{item.name} · {item.place}</p>
            </article>
          ))}
        </div>
      </section>

      {related.length ? (
        <section className="section container">
          <div className="section-head"><h2>Alongside it</h2></div>
          <div className="grid-products">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div>
        </section>
      ) : null}

      {recent.length ? (
        <section className="section container">
          <div className="section-head"><h2>Recently viewed</h2></div>
          <div className="grid-products">{recent.map((item) => <ProductCard key={item.id} product={item} />)}</div>
        </section>
      ) : null}

      <div className="buybar">
        <div>
          <strong>{product.name}</strong>
          <span>{money(weight.price)}</span>
        </div>
        <button type="button" className="btn primary" disabled={stock < 1} onClick={() => addToCart(product.id, weight.id, qty, { open: true })}>
          {stock < 1 ? 'Resting' : 'Add'}
        </button>
      </div>
    </div>
  )
}
