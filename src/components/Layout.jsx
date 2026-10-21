import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { categories, products } from '../data/catalog'
import { useStore } from '../context/Store'
import { money } from '../lib/format'
import { IconBag, IconClose, IconHeart, IconMenu, IconSearch, IconUser, Mark } from './Icons'
import Summary from './Summary'
import { Photo } from './ui'

const year = new Date().getFullYear()

const shopLinks = [
  { to: '/shop', label: 'All harvests' },
  ...categories.map((category) => ({
    to: `/shop?category=${category.id}`,
    label: category.name,
  })),
]

export default function Layout() {
  const { count, wish, cartOpen, setCartOpen, toasts, dismissToast, subscribe } = useStore()
  const [stuck, setStuck] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [letter, setLetter] = useState('')
  const [letterNote, setLetterNote] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
    setCartOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname, setCartOpen])

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        setSearchOpen(false)
        setCartOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setCartOpen])

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen || cartOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen, searchOpen, cartOpen])

  const results = query.trim()
    ? products
        .filter((product) =>
          `${product.name} ${product.origin} ${product.short}`.toLowerCase().includes(query.trim().toLowerCase()),
        )
        .slice(0, 6)
    : []

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="announce">
        <Link to="/policies#shipping">Complimentary shipping across Pakistan over Rs 8,000</Link>
        <span aria-hidden="true"> · </span>
        <Link to="/shop">Code HONEY10 for 10% off</Link>
      </div>
      <header className={`header ${stuck ? 'stuck' : ''}`}>
        <div className="header-bar">
          <Link to="/" className="brand">
            <Mark />
            <span className="brand-name">
              Mountain and Hives
              <small>Gilgit · dry fruit & honey</small>
            </span>
          </Link>
          <nav className="desk-nav" aria-label="Primary">
            <div className="drop">
              <NavLink to="/shop">Shop</NavLink>
              <div className="drop-panel">
                {shopLinks.map((link) => (
                  <Link key={link.label} to={link.to}>{link.label}</Link>
                ))}
              </div>
            </div>
            <NavLink to="/shop?category=honey">Honey</NavLink>
            <NavLink to="/shop?category=gifts">Gifts</NavLink>
            <NavLink to="/journal">Journal</NavLink>
            <NavLink to="/about">Our story</NavLink>
          </nav>
          <div className="tools">
            <button type="button" className="icon-btn" aria-label="Search the harvest" onClick={() => setSearchOpen(true)}>
              <IconSearch />
            </button>
            <Link to="/wishlist" className="icon-btn" aria-label={`Wishlist, ${wish.length} saved`}>
              <IconHeart />
              {wish.length > 0 ? <span className="count">{wish.length}</span> : null}
            </Link>
            <Link to="/account" className="icon-btn hide-sm" aria-label="Account">
              <IconUser />
            </Link>
            <button type="button" className="icon-btn" aria-label={`Bag, ${count} ${count === 1 ? 'item' : 'items'}`} onClick={() => setCartOpen(true)}>
              <IconBag />
              {count > 0 ? <span className="count">{count}</span> : null}
            </button>
            <button
              type="button"
              className="icon-btn menu-btn"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <IconMenu />
            </button>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div className="mobile-nav" role="dialog" aria-label="Menu">
          <button type="button" className="icon-btn close-abs" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
            <IconClose />
          </button>
          {shopLinks.map((link) => (
            <Link key={link.label} to={link.to}>{link.label}</Link>
          ))}
          <Link to="/journal">Journal</Link>
          <Link to="/about">Our story</Link>
          <Link to="/account">Account</Link>
          <Link to="/contact">Contact</Link>
        </div>
      ) : null}

      {searchOpen ? (
        <div className="search-modal" role="dialog" aria-label="Search">
          <button type="button" className="overlay" aria-label="Close search" onClick={() => setSearchOpen(false)} />
          <form
            className="search-box"
            onSubmit={(event) => {
              event.preventDefault()
              navigate(`/shop?q=${encodeURIComponent(query.trim())}`)
              setSearchOpen(false)
            }}
          >
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search almonds, honey, saffron…"
              aria-label="Search"
            />
            <button type="button" className="icon-btn" aria-label="Close search" onClick={() => setSearchOpen(false)}>
              <IconClose />
            </button>
            <div className="search-list">
              {results.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="hit" onClick={() => setSearchOpen(false)}>
                  <span className="frame hit-photo"><Photo image={product.images[0]} alt="" /></span>
                  <span>
                    <strong>{product.name}</strong>
                    <em>{product.origin}</em>
                  </span>
                  <b>{money(product.weights[0].price)}</b>
                </Link>
              ))}
              {query.trim() && results.length === 0 ? <p className="muted">Nothing matches that search.</p> : null}
            </div>
          </form>
        </div>
      ) : null}

      {cartOpen ? <button type="button" className="overlay" aria-label="Close bag" onClick={() => setCartOpen(false)} /> : null}
      <aside className={`drawer ${cartOpen ? 'open' : ''}`} aria-hidden={!cartOpen} inert={!cartOpen}>
        <div className="drawer-head">
          <h2>Your bag</h2>
          <button type="button" className="icon-btn" aria-label="Close bag" onClick={() => setCartOpen(false)}>
            <IconClose />
          </button>
        </div>
        <Summary variant="drawer" />
      </aside>

      <main id="main">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div className="foot-brand">
            <Link to="/" className="brand on-dark">
              <Mark />
              <span className="brand-name">
                Mountain and Hives
                <small>A Gilgit packing house</small>
              </span>
            </Link>
            <p>Almonds, chilgoza, apricots, and raw honey, packed while the season is still in them.</p>
            <p className="fine">Harvest Room, Skardu Road, Gilgit</p>
          </div>
          <div>
            <h3>Shop</h3>
            {shopLinks.map((link) => <Link key={link.label} to={link.to}>{link.label}</Link>)}
            <Link to="/shop?sale=1">On offer</Link>
          </div>
          <div>
            <h3>House</h3>
            <Link to="/about">Our story</Link>
            <Link to="/journal">Journal</Link>
            <Link to="/faq">Questions</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/account">Account</Link>
          </div>
          <div>
            <h3>Care</h3>
            <Link to="/policies#shipping">Shipping</Link>
            <Link to="/policies#returns">Returns</Link>
            <Link to="/policies#privacy">Privacy</Link>
            <Link to="/wishlist">Wishlist</Link>
            <form
              className="footer-news"
              onSubmit={(event) => {
                event.preventDefault()
                const result = subscribe(letter)
                setLetterNote(result.ok ? 'You are on the harvest list.' : result.error)
                if (result.ok) setLetter('')
              }}
            >
              <label htmlFor="foot-email">Harvest notes</label>
              <div>
                <input
                  id="foot-email"
                  type="email"
                  value={letter}
                  onChange={(event) => setLetter(event.target.value)}
                  placeholder="Email address"
                  required
                />
                <button type="submit" className="btn small light">Join</button>
              </div>
              {letterNote ? <p className="fine">{letterNote}</p> : null}
            </form>
          </div>
        </div>
        <div className="container legal">
          <p>© {year} Mountain and Hives. Packed in a room that handles tree nuts and honey.</p>
          <p>Card and cash on delivery. Demonstration checkout — no payment is taken.</p>
        </div>
      </footer>

      <div className="toasts" aria-live="polite">
        {toasts.map((toast) => (
          <button
            type="button"
            key={toast.id}
            className={`toast ${toast.tone === 'err' ? 'err' : ''}`}
            onClick={() => dismissToast(toast.id)}
          >
            {toast.message}
          </button>
        ))}
      </div>
    </>
  )
}
