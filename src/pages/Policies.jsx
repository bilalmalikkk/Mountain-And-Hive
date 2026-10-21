import { useTitle } from '../lib/useTitle'

export default function Policies() {
  useTitle('Policies')
  return (
    <div className="page container policy">
      <header className="page-intro">
        <p className="eyebrow">Care</p>
        <h1>Shipping, returns, and what this shop stores.</h1>
      </header>
      <section id="shipping">
        <h2>Shipping</h2>
        <p>Orders placed before 14:00 PKT leave the Gilgit room the next working day, Monday to Saturday. Standard delivery inside Pakistan is 3–6 business days and costs Rs 350, or nothing when the bag is Rs 8,000 or more. Express is Rs 750 and aims for 1–3 business days in major cities.</p>
        <p>International parcels to the UAE, Saudi Arabia, the UK, the US, Canada, and Germany take 7–14 business days on the standard service (Rs 1,600, free over Rs 20,000) or 4–7 business days by express (Rs 2,800). Weather on the Karakoram road can add a day. We will say so rather than pretend.</p>
      </section>
      <section id="returns">
        <h2>Returns</h2>
        <p>Unopened tins and jars can be returned within 14 days of delivery. Write to hello@mountainandhives.com with your order number and we will arrange it. Honey that has crystallised is behaving correctly and is not eligible as a fault.</p>
        <p>If a parcel arrives damaged, or a lot tastes dull or stale, tell us within 7 days. We replace it or refund the tin. Perishable food that has been opened cannot come back onto the shelf, so we ask for a photo and then we make it right.</p>
      </section>
      <section id="privacy">
        <h2>Privacy</h2>
        <p>This is a demonstration shop. Your bag, wishlist, account, orders, and messages are stored in this browser only. Nothing is sent to a server. Card numbers are not kept — a demo receipt may show the last four digits.</p>
        <p>Passwords are hashed before they are saved on the device. Clearing the browser will clear the account. Do not use a password you use anywhere else.</p>
        <p>The harvest list stores the email you type, again only in this browser. There is no mailing provider attached.</p>
      </section>
    </div>
  )
}
