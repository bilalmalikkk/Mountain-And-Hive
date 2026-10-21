import { Link } from 'react-router-dom'
import { Photo } from '../components/ui'
import { useTitle } from '../lib/useTitle'

export default function About() {
  useTitle('Our story')
  return (
    <div className="page">
      <header className="about-hero">
        <div className="container about-grid">
          <div>
            <p className="eyebrow">Our story</p>
            <h1>A packing house in Gilgit, for fruit that still tastes of where it grew.</h1>
            <p className="lede">
              Mountain and Hives started as a room on Skardu Road where two harvests met: dry fruit from the valleys,
              and honey from the meadows above town. We still work at that size.
            </p>
          </div>
          <div className="frame landscape">
            <Photo image="/images/mountain.jpg" alt="A mountain valley in clear weather" />
          </div>
        </div>
      </header>
      <section className="section container prose">
        <p>
          Most dry fruit in a city shop has been pooled, held, and polished until the season is gone.
          We buy smaller. A grower brings a lot. We taste it. If it is sweet, clean, and what it claims to be,
          we pack it under a lot number and send it on.
        </p>
        <p>
          The house name is literal. The mountains give the almonds, apricots, walnuts, and chilgoza.
          The hives give the honey. Dates, saffron, and cashews come from partner groves — Panjgur, Pampore,
          and a coastal kernel we roast ourselves — and the tin says so.
        </p>
      </section>
      <section className="section container">
        <div className="values">
          <article><span>01</span><h2>Taste before price</h2><p>A cheap lot that has gone dull does not get the mark, even when the season is thin.</p></article>
          <article><span>02</span><h2>Say the origin</h2><p>Hunza, Neelum, Zhob, Shigar, Panjgur, Pampore. If we finished it in Gilgit, we say that too.</p></article>
          <article><span>03</span><h2>Leave the honey alone</h2><p>Strained, not heated. If it sets in the cupboard, that is the jar telling the truth.</p></article>
          <article><span>04</span><h2>Pack it to arrive</h2><p>Glass is wrapped. Tins are sealed. A gift note is written on a card, not printed on a slip.</p></article>
        </div>
      </section>
      <section className="section container split-text">
        <div>
          <p className="eyebrow">The room</p>
          <h2>Visit, or write.</h2>
          <p>Harvest Room, Skardu Road, Gilgit. Monday to Saturday, 10:00–18:00 PKT. If you are passing through, the kettle is usually on.</p>
          <Link to="/contact" className="btn primary">Contact the house</Link>
        </div>
        <div className="frame landscape">
          <Photo image="/images/ridge.jpg" alt="Mountain peaks above a layer of cloud" />
        </div>
      </section>
    </div>
  )
}
