import { Link } from 'react-router-dom'
import { getCategory } from '../data/catalog'
import { money } from '../lib/format'
import { useStore } from '../context/Store'
import { IconHeart } from './Icons'
import { Photo, Stars } from './ui'

export default function ProductCard({ product }) {
  const { addToCart, toggleWish, inWish, stockOf } = useStore()
  const stock = stockOf(product)
  const weight = product.weights[0]
  const wished = inWish(product.id)
  const category = getCategory(product.category)
  const off = weight.compareAt ? Math.round((1 - weight.price / weight.compareAt) * 100) : 0

  return (
    <article className="pcard">
      <div className="frame pcard-media">
        <Link to={`/product/${product.id}`}>
          <Photo image={product.images[0]} alt={product.name} />
        </Link>
        <button
          type="button"
          className={`wish ${wished ? 'on' : ''}`}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name}`}
          onClick={() => toggleWish(product.id)}
        >
          <IconHeart filled={wished} />
        </button>
        {stock < 1 ? <span className="badge">Resting</span> : null}
        {stock > 0 && product.badge ? <span className="badge">{product.badge}</span> : null}
        {stock > 0 && off > 0 ? <span className="badge sale">−{off}%</span> : null}
      </div>
      <div className="pcard-body">
        <Link to={`/product/${product.id}`}>
          <p className="kicker">{category?.name}</p>
          <h3>{product.name}</h3>
        </Link>
        <p className="card-meta">
          <Stars value={product.rating} />
          <span>{product.reviewCount}</span>
        </p>
        <p className="price">
          {weight.compareAt ? <s className="was">{money(weight.compareAt)}</s> : null}
          <strong>{money(weight.price)}</strong>
          {product.weights.length > 1 ? <span className="from"> · {weight.label}</span> : null}
        </p>
        {stock > 0 && stock <= 8 ? <p className="low">Only {stock} left</p> : null}
        <button
          type="button"
          className="add-btn"
          disabled={stock < 1}
          onClick={() => addToCart(product.id, weight.id, 1)}
        >
          {stock < 1 ? 'Resting this season' : 'Add to bag'}
        </button>
      </div>
    </article>
  )
}
