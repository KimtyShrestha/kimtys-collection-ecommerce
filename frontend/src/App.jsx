import { ToastProvider } from './context/ToastContext'
import DesignSystem from './pages/DesignSystem'

function App() {
  return (
    <ToastProvider>
      <DesignSystem />
    </ToastProvider>
  )
}

export default App