import { Route, Routes } from 'react-router-dom'
import { StoreProvider } from './context/Store'
import Layout from './components/Layout'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Order from './pages/Order'
import Wishlist from './pages/Wishlist'
import Account from './pages/Account'
import About from './pages/About'
import { Article, Journal } from './pages/Journal'
import Contact from './pages/Contact'
import Faq from './pages/Faq'
import Policies from './pages/Policies'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <StoreProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:id" element={<Product />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order/:id" element={<Order />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="account" element={<Account />} />
          <Route path="about" element={<About />} />
          <Route path="journal" element={<Journal />} />
          <Route path="journal/:slug" element={<Article />} />
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<Faq />} />
          <Route path="policies" element={<Policies />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </StoreProvider>
  )
}
