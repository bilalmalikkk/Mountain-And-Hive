import { Link } from 'react-router-dom'
import { getProduct } from '../data/catalog'
import { useStore } from '../context/Store'
import { useTitle } from '../lib/useTitle'
import ProductCard from '../components/ProductCard'

export default function Wishlist() {
  useTitle('Wishlist')
  const { wish } = useStore()
  const items = wish.map(getProduct).filter(Boolean)

  return (
    <div className="page container">
      <header className="page-intro">
        <p className="eyebrow">Saved</p>
        <h1>Wishlist</h1>
        <p className="lede">Tins you’ve set aside. They stay in this browser until you take them, or until the lot sells through.</p>
      </header>
      {items.length ? (
        <div className="grid-products wide">
          {items.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="empty">
          <h2>Nothing saved yet.</h2>
          <p>Use the heart on a tin to keep it here.</p>
          <Link to="/shop" className="btn primary">Shop the harvest</Link>
        </div>
      )}
    </div>
  )
}
