import { useEffect } from 'react'

// Prevents the page behind an open drawer/modal from scrolling.
export function useBodyScrollLock(active) {
  useEffect(() => {
    if (!active) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [active])
}