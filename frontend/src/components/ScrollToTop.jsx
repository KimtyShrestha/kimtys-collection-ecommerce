import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Resets scroll on route change. Ignores query-string-only changes so
// filtering the shop doesn't jump the page (Shop handles its own scroll).
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  return null
}

export default ScrollToTop