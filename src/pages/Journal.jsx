import { Link, useParams } from 'react-router-dom'
import { getPost, posts } from '../data/journal'
import { Photo } from '../components/ui'
import { useTitle } from '../lib/useTitle'

export function Journal() {
  useTitle('Journal')
  return (
    <div className="page container">
      <header className="page-intro">
        <p className="eyebrow">Journal</p>
        <h1>Notes from the harvest.</h1>
        <p className="lede">Short writing from the packing room. Grading, honey, and how a crate actually leaves Gilgit.</p>
      </header>
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
  )
}

export function Article() {
  const { slug } = useParams()
  const post = getPost(slug)
  useTitle(post?.title || 'Journal')

  if (!post) {
    return (
      <div className="page container empty">
        <h1>That note has been filed away.</h1>
        <Link to="/journal" className="btn primary">Back to the journal</Link>
      </div>
    )
  }

  return (
    <article className="page container article">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/journal">Journal</Link>
        <span>/</span>
        <span aria-current="page">{post.title}</span>
      </nav>
      <p className="eyebrow">{post.kicker} · {post.date}</p>
      <h1>{post.title}</h1>
      <div className="frame landscape article-photo">
        <Photo image={post.image} alt="" eager />
      </div>
      <div className="prose">
        {post.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
      <Link to="/shop" className="btn primary">Shop the harvest</Link>
    </article>
  )
}
