import { createContext, useContext, useEffect, useState } from 'react'
import { apiLogin, apiRegister, apiMe } from '../services/authService'
import { getToken, storeToken, clearToken } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // True while we check for an existing session on first load —
  // prevents guards from redirecting before we know who the user is.
  const [initialising, setInitialising] = useState(true)

  useEffect(() => {
    async function restoreSession() {
      if (!getToken()) {
        setInitialising(false)
        return
      }
      try {
        const currentUser = await apiMe()
        setUser(currentUser)
      } catch {
        // Token expired or invalid — clear it silently.
        clearToken()
      } finally {
        setInitialising(false)
      }
    }
    restoreSession()
  }, [])

  async function login({ email, password, remember }) {
    const { user: loggedInUser, token } = await apiLogin({ email, password })
    storeToken(token, remember)
    setUser(loggedInUser)
    return loggedInUser
  }

  async function register(payload) {
    const { user: newUser, token } = await apiRegister(payload)
    storeToken(token, true)
    setUser(newUser)
    return newUser
  }

  function logout() {
    clearToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, initialising, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }
  return context
}