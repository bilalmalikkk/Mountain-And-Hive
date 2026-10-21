import { Link, useParams } from 'react-router-dom'
import { useStore } from '../context/Store'
import { Photo } from '../components/ui'
import { money, prettyDate } from '../lib/format'
import { useTitle } from '../lib/useTitle'

const steps = ['Received', 'Packing', 'With the carrier', 'Delivered']

export default function Order() {
  const { id } = useParams()
  const { orders } = useStore()
  const order = orders.find((item) => item.id === id)
  useTitle(order ? `Order ${order.id}` : 'Order')

  if (!order) {
    return (
      <div className="page container empty">
        <h1>We can’t find that order in this browser.</h1>
        <p>Orders placed here stay on this device. If you used another browser, the receipt will be there.</p>
        <Link to="/account" className="btn primary">Go to your account</Link>
      </div>
    )
  }

  return (
    <div className="page container order-page">
      <header className="order-top">
        <p className="eyebrow">Order {order.id}</p>
        <h1>We’re packing this.</h1>
        <p className="lede">
          A receipt for {order.email}. This demonstration order is saved in this browser only — nothing has been charged.
        </p>
      </header>
      <ol className="timeline">
        {steps.map((step, index) => (
          <li key={step} className={index <= 1 ? 'on' : ''}>
            <span>{index + 1}</span>
            {step}
          </li>
        ))}
      </ol>
      <div className="order-grid">
        <section>
          <h2>In the crate</h2>
          <ul className="lines">
            {order.items.map((item) => (
              <li className="line" key={`${item.productId}-${item.weight}`}>
                <Link to={`/product/${item.productId}`} className="frame line-photo">
                  <Photo image={item.image} alt="" />
                </Link>
                <div className="line-copy">
                  <Link to={`/product/${item.productId}`}>{item.name}</Link>
                  <p className="muted">{item.weight} · Qty {item.qty}</p>
                </div>
                <strong>{money(item.total)}</strong>
              </li>
            ))}
          </ul>
        </section>
        <aside className="summary">
          <h2>Receipt</h2>
          <p>{prettyDate(order.createdAt)}</p>
          <p>
            {order.name}<br />
            {order.address}<br />
            {order.city}{order.region ? `, ${order.region}` : ''} {order.postal}<br />
            {order.country}<br />
            {order.phone}
          </p>
          <p>{order.methodName} · {order.paymentType === 'cod' ? 'Cash on delivery' : `Card ending ${order.last4}`}</p>
          {order.giftNote ? <p><b>Gift note.</b> {order.giftNote}</p> : null}
          {order.notes ? <p><b>Delivery.</b> {order.notes}</p> : null}
          <dl className="totals">
            <div><dt>Subtotal</dt><dd>{money(order.subtotal)}</dd></div>
            {order.discount > 0 ? <div><dt>{order.promoCode || 'Offer'}</dt><dd>−{money(order.discount)}</dd></div> : null}
            <div><dt>Shipping</dt><dd>{order.shipping === 0 ? 'Free' : money(order.shipping)}</dd></div>
            <div><dt>GST 5%</dt><dd>{money(order.tax)}</dd></div>
            <div className="grand"><dt>Total</dt><dd>{money(order.total)}</dd></div>
          </dl>
          <Link to="/shop" className="btn primary full">Back to the harvest</Link>
        </aside>
      </div>
    </div>
  )
}
