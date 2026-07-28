import { useEffect } from 'react'

// Sets the document title; restores nothing on unmount because the
// next page sets its own.
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title
      ? `${title} · Kimty's Collection`
      : "Kimty's Collection"
  }, [title])
}