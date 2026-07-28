import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'

// Fixed banner shown whenever the browser reports being offline.
function NetworkStatus() {
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    function goOnline() { setOnline(true) }
    function goOffline() { setOnline(false) }
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  if (online) return null

  return (
    <div
      role="status"
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-2 bg-gray-900 px-4 py-2.5 text-sm text-white"
    >
      <WifiOff className="h-4 w-4" aria-hidden="true" />
      You're offline — some features won't work until your connection returns.
    </div>
  )
}

export default NetworkStatus