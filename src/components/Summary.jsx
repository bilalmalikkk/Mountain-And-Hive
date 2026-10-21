import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/Store'
import { money } from '../lib/format'
import { FREE_SHIPPING, quote } from '../lib/pricing'
import { Photo, Qty } from './ui'

export default function Summary({ variant = 'cart', methodId = 'standard', country = 'Pakistan' }) {
  const { cart, subtotal, promo, applyPromo, clearPromo, setQty, removeLine, stockOf } = useStore()
  const [code, setCode] = useState('')
  const totals = quote({ subtotal, promo, methodId, country })
  const editable = variant !== 'checkout'
  const remain = Math.max(0, FREE_SHIPPING - subtotal)
  const progress = Math.min(100, (subtotal / FREE_SHIPPING) * 100)
  const showMeter = country === 'Pakistan' && methodId === 'standard'

  if (!cart.length) {
    return (
      <div className="empty compact">
        <h2>Your bag is empty</h2>
        <p>The harvest is in. Almonds, honey, and apricots are waiting.</p>
        <Link to="/shop" className="btn primary">Shop the harvest</Link>
      </div>
    )
  }

  return (
    <div className={`summary summary-${variant}`}>
      <ul className="lines">
        {cart.map((line) => (
          <li className="line" key={line.lineId}>
            <Link to={`/product/${line.productId}`} className="frame line-photo">
              <Photo image={line.product.images[0]} alt="" />
            </Link>
            <div className="line-copy">
              <Link to={`/product/${line.productId}`}>{line.product.name}</Link>
              <p className="muted">{line.weight.label}</p>
              {editable ? (
                <Qty value={line.qty} max={stockOf(line.product)} onChange={(qty) => setQty(line.lineId, qty)} />
              ) : (
                <p className="muted">Qty {line.qty}</p>
              )}
            </div>
            <div className="line-side">
              <strong>{money(line.total)}</strong>
              {editable ? (
                <button type="button" className="text-btn" onClick={() => removeLine(line.lineId)}>
                  Remove
                </button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      {showMeter ? (
        <div className="meter">
          <div className="meter-bar"><span style={{ width: `${progress}%` }} /></div>
          <p>{remain === 0 ? 'Complimentary shipping across Pakistan is included.' : `Add ${money(remain)} for complimentary shipping in Pakistan.`}</p>
        </div>
      ) : null}

      {variant !== 'drawer' ? (
        <form
          className="promo"
          onSubmit={(event) => {
            event.preventDefault()
            if (applyPromo(code)) setCode('')
          }}
        >
          {promo ? (
            <p className="promo-on">
              <span>{promo.code} · {promo.label}</span>
              <button type="button" onClick={clearPromo}>Remove</button>
            </p>
          ) : (
            <>
              <input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="Gift code"
                aria-label="Gift code"
              />
              <button type="submit" className="btn small">Apply</button>
            </>
          )}
          {promo && totals.discount === 0 ? (
            <p className="notice">Add more to the bag before {promo.code} can apply.</p>
          ) : null}
        </form>
      ) : null}

      <dl className="totals">
        <div><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
        {totals.discount > 0 ? <div><dt>Offer</dt><dd>−{money(totals.discount)}</dd></div> : null}
        {variant !== 'drawer' ? (
          <>
            <div><dt>Shipping</dt><dd>{totals.shipping === 0 ? 'Free' : money(totals.shipping)}</dd></div>
            <div><dt>GST 5%</dt><dd>{money(totals.tax)}</dd></div>
          </>
        ) : null}
        <div className="grand"><dt>Total</dt><dd>{money(variant === 'drawer' ? subtotal : totals.total)}</dd></div>
      </dl>

      {variant === 'drawer' ? (
        <div className="summary-actions">
          <Link to="/cart" className="btn ghost full">View bag</Link>
          <Link to="/checkout" className="btn primary full">Checkout</Link>
        </div>
      ) : null}
      {variant === 'cart' ? (
        <Link to="/checkout" className="btn primary full">Checkout</Link>
      ) : null}
      {variant === 'drawer' ? <p className="fine">Shipping and tax are confirmed at checkout.</p> : null}
    </div>
  )
}
