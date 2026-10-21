import { Link } from 'react-router-dom'
import { categories, products } from '../data/catalog'
import { posts } from '../data/journal'
import { useTitle } from '../lib/useTitle'
import ProductCard from '../components/ProductCard'
import { Photo } from '../components/ui'
import { useState } from 'react'
import { useStore } from '../context/Store'

const ticker = ['Hunza almonds', 'Chilgoza', 'Wildflower honey', 'Kashmir walnuts', 'Panjgur dates', 'Pampore saffron', 'Pistachios', 'Black raisins']

export default function Home() {
  useTitle('')
  const featured = products.filter((product) => product.featured)
  const gifts = products.filter((product) => product.category === 'gifts')
  const offers = products.filter((product) => product.weights.some((weight) => weight.compareAt))
  const { subscribe } = useStore()
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Gilgit · a harvest house</p>
          <h1>Dry fruit and honey from the <em>high valleys.</em></h1>
          <p className="lede">
            Mountain and Hives packs small lots of almonds, chilgoza, walnuts, apricots, and raw honey.
            We buy from valley growers and send the tins out while the season is still in them.
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="btn primary">Shop the harvest</Link>
            <Link to="/about" className="btn ghost">Our story</Link>
          </div>
          <dl className="stats">
            <div><dt>Growers</dt><dd>40+</dd></div>
            <div><dt>Packing room</dt><dd>Gilgit</dd></div>
            <div><dt>Free shipping</dt><dd>Over Rs 8,000</dd></div>
          </dl>
        </div>
        <div className="hero-stage">
          <div className="frame hero-main">
            <Photo image="/images/mountain.jpg" alt="A wide mountain valley under a bright sky" eager />
          </div>
          <div className="frame hero-side">
            <Photo image="/images/honey.jpg" alt="A jar of wildflower honey" eager />
          </div>
          <div className="float-card">
            <p>Lot 26·HNY·01</p>
            <strong>Wildflower honey</strong>
            <span>Strained. Never heated.</span>
          </div>
        </div>
      </section>

      <section className="trust">
        <div className="container trust-row">
          <p><b>Unsulphured fruit</b><span>Apricots stay amber</span></p>
          <p><b>Raw honey</b><span>Strained, not heated</span></p>
          <p><b>Numbered lots</b><span>You can see the harvest</span></p>
          <p><b>Tins and glass</b><span>Packed to travel</span></p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Shop by grove</p>
            <h2>Five shelves, one packing room.</h2>
          </div>
          <div className="cat-grid">
            {categories.map((category) => (
              <Link key={category.id} to={`/shop?category=${category.id}`} className="cat-card">
                <span className="frame">
                  <Photo image={category.image} alt={category.image.alt} />
                </span>
                <span>
                  <strong>{category.name}</strong>
                  <em>{category.line}</em>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">In the pantry this week</p>
            <h2>What we would send first.</h2>
            <Link to="/shop">View the full harvest</Link>
          </div>
          <div className="grid-products wide">
            {featured.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      <section className="editorial">
        <div className="editorial-media">
          <div className="frame landscape"><Photo image="/images/peak.jpg" alt="A sharp, snow-covered peak above dry grass" /></div>
          <div className="frame portrait"><Photo image="/images/almonds.jpg" alt="Whole almonds" /></div>
        </div>
        <div className="editorial-copy">
          <p className="eyebrow">01 — The house</p>
          <h2>We buy from valleys, not from a warehouse aisle.</h2>
          <p>
            The packing room is in Gilgit. Almonds and apricots come from Hunza, chilgoza from the high west,
            walnuts from Neelum, honey from the meadows above town. A few things — cashews, saffron, dates —
            come from partner groves, and we say so on the tin.
          </p>
          <p>
            If a lot fails the tray, it does not get the mark. That is the whole method.
          </p>
          <Link to="/about" className="btn ghost">Read the story</Link>
        </div>
      </section>

      <section className="section calendar-wrap">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">02 — The year</p>
            <h2>A short calendar.</h2>
          </div>
          <ol className="calendar">
            <li><span>Jun–Jul</span><strong>Mulberry season</strong><em>The orchards turn, and the hives start.</em></li>
            <li><span>August</span><strong>Apricots</strong><em>Sun-dried in Hunza, stone left in.</em></li>
            <li><span>September</span><strong>Almonds & walnuts</strong><em>The kernels and the shells.</em></li>
            <li><span>October</span><strong>Honey & chilgoza</strong><em>The short, expensive weeks.</em></li>
            <li><span>Winter</span><strong>Dates, saffron, crates</strong><em>Partner lots and the gift shelf.</em></li>
          </ol>
        </div>
      </section>

      <section className="feature">
        <div>
          <p className="eyebrow">03 — The hive</p>
          <h2>Honey that still knows the meadow.</h2>
          <p>
            We strain wildflower honey and leave it. It may set hard in a cool cupboard.
            That is the sugar settling, not a fault. A bowl of warm water brings it back.
          </p>
          <Link to="/product/wildflower-honey" className="btn light">Shop wildflower honey</Link>
        </div>
        <div className="frame feature-photo">
          <Photo image="/images/dipper.jpg" alt="Honey falling from a wooden dipper into a jar" />
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...ticker, ...ticker].map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">04 — For someone else</p>
            <h2>Crates, and a few kinder prices.</h2>
          </div>
          <div className="grid-products">
            {[...gifts, ...offers.filter((product) => product.category !== 'gifts')].slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section steps-wrap">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">05 — From valley to door</p>
            <h2>Four quiet steps.</h2>
          </div>
          <ol className="steps">
            <li><span>01</span><h3>Harvest</h3><p>Growers bring the lot to Gilgit. We taste it before we talk about a price.</p></li>
            <li><span>02</span><h3>Grade</h3><p>Whole nuts stay. Broken chilgoza may go to the mix. Stale fruit is refused.</p></li>
            <li><span>03</span><h3>Pack</h3><p>Tins, glass, and a lot number. Gift notes are written, not printed.</p></li>
            <li><span>04</span><h3>Send</h3><p>Across Pakistan in a few days. Farther away, we pack glass as if it matters.</p></li>
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container quotes">
          <figure>
            <blockquote>“The Hunza apricots taste like the ones from my grandmother’s kitchen, just cleaner and better packed.”</blockquote>
            <figcaption>Sana I. · Islamabad</figcaption>
          </figure>
          <figure>
            <blockquote>“Chilgoza usually arrives broken. These were whole, buttery, and worth keeping for guests.”</blockquote>
            <figcaption>Omar F. · Karachi</figcaption>
          </figure>
          <figure>
            <blockquote>“The honey set hard in the cupboard. A warm bowl brought it back. That is how I knew it was raw.”</blockquote>
            <figcaption>Helen P. · Manchester</figcaption>
          </figure>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Journal</p>
            <h2>Notes from the harvest.</h2>
            <Link to="/journal">All notes</Link>
          </div>
          <div className="journal-tease">
            {posts.map((post) => (
              <Link key={post.slug} to={`/journal/${post.slug}`} className="jcard">
                <span className="frame"><Photo image={post.image} alt="" /></span>
                <span className="kicker">{post.kicker} · {post.date}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="band-gallery">
        {[
          ['/images/ridge.jpg', 'Peaks above cloud'],
          ['/images/almonds.jpg', 'Hunza almonds'],
          ['/images/stall.jpg', 'Dried fruit'],
          ['/images/saffron.jpg', 'Saffron threads'],
        ].map(([src, alt]) => (
          <div className="frame" key={src}><Photo image={src} alt={alt} /></div>
        ))}
      </section>

      <section className="newsletter">
        <div className="container">
          <p className="eyebrow">The list</p>
          <h2>A note when the next lot is packed.</h2>
          <p>No weekly noise. We write when honey, chilgoza, or a crate run is actually ready.</p>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              const result = subscribe(email)
              setNote(result.ok ? 'You are on the list. We will write when the next lot is ready.' : result.error)
              if (result.ok) setEmail('')
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              aria-label="Email address"
            />
            <button type="submit" className="btn light">Join</button>
          </form>
          {note ? <p className="fine">{note}</p> : null}
        </div>
      </section>
    </div>
  )
}
