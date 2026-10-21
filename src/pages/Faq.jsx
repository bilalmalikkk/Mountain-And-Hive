import { Accord } from '../components/ui'
import { useTitle } from '../lib/useTitle'

const items = [
  ['Where do you ship?', 'Across Pakistan in 3–6 business days, faster in the major cities if you choose express. We also send to the UAE, Saudi Arabia, the UK, the US, Canada, and Germany. Glass is packed as if the road is long.'],
  ['When is shipping free?', 'Standard shipping is free inside Pakistan on orders over Rs 8,000, and free abroad on orders over Rs 20,000. Express is always charged.'],
  ['Can I pay on delivery?', 'Yes, inside Pakistan. Cash on delivery is collected by the rider. Orders leaving the country are card only, and this shop is a demonstration — no real charge is made.'],
  ['Do you take gift notes?', 'Yes. Leave one at checkout and we write it on a card under the lid. Gift crates do not include a price slip inside.'],
  ['Why did my honey turn solid?', 'Raw honey crystallises when it is cool. It has not spoiled. Stand the jar in warm water and stir as it loosens. Do not boil it.'],
  ['Are the apricots sulphured?', 'No. Hunza apricots are dried in the sun and stay amber. Bright orange fruit has usually been treated. We do not do that.'],
  ['What about allergens?', 'The packing room handles tree nuts and honey. Each tin lists what is in it. If you have a serious allergy, write to us before you order.'],
  ['Can I return a tin?', 'Unopened tins can come back within 14 days. Honey that has crystallised is not a fault. If something arrives damaged or dull, we replace it.'],
  ['Do you sell wholesale?', 'Yes, for shops that will keep the lots intact and not rebottle the honey. Use the contact form and choose Wholesale.'],
]

export default function Faq() {
  useTitle('Questions')
  return (
    <div className="page container faq-page">
      <header className="page-intro">
        <p className="eyebrow">Questions</p>
        <h1>Before you write to us.</h1>
      </header>
      <div className="accord-list">
        {items.map(([title, body]) => (
          <Accord key={title} title={title}><p>{body}</p></Accord>
        ))}
      </div>
    </div>
  )
}
