import { Link } from 'react-router-dom'
import { useTitle } from '../lib/useTitle'

export default function NotFound() {
  useTitle('Not found')
  return (
    <div className="page container empty">
      <p className="eyebrow">404</p>
      <h1>This path leaves the valley.</h1>
      <p>The page is not on the shelf. The harvest still is.</p>
      <Link to="/shop" className="btn primary">Shop the harvest</Link>
    </div>
  )
}
