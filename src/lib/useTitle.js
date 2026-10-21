import { useEffect } from 'react'

export function useTitle(title) {
  useEffect(() => {
    document.title = title
      ? `${title} · Mountain and Hives`
      : 'Mountain and Hives — Dry fruit and wild honey'
  }, [title])
}
