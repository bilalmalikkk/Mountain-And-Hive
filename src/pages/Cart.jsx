import { Link } from 'react-router-dom'
import Summary from '../components/Summary'
import { useStore } from '../context/Store'
import { useTitle } from '../lib/useTitle'

export default function Cart() {
  useTitle('Your bag')
  const { count, clearCart } = useStore()

  return (
    <div className="page container cart-page">
      <header className="page-intro">
        <p className="eyebrow">Bag</p>
        <h1>Your bag</h1>
      </header>
      {count > 0 ? (
        <div className="cart-layout">
          <div>
            <div className="cart-tools">
              <p className="muted">{count} {count === 1 ? 'item' : 'items'}</p>
              <button type="button" className="text-btn" onClick={clearCart}>Clear bag</button>
            </div>
            <Summary variant="cart" />
          </div>
          <aside className="cart-aside">
            <h2>Before you checkout</h2>
            <p>Try <b>HONEY10</b> for 10% off, or <b>HIVE500</b> for Rs 500 off a bag over Rs 3,000.</p>
            <p>Orders over Rs 8,000 ship free inside Pakistan.</p>
            <Link to="/shop" className="text-link">Continue browsing</Link>
          </aside>
        </div>
      ) : (
        <Summary variant="cart" />
      )}
    </div>
  )
}
