import axios from 'axios'

// Single configured HTTP client for the whole application.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// The token lives in localStorage ("remember me") or
// sessionStorage (cleared when the browser closes).
export function getToken() {
  return localStorage.getItem('kc_token') || sessionStorage.getItem('kc_token')
}

export function storeToken(token, remember) {
  clearToken()
  if (remember) {
    localStorage.setItem('kc_token', token)
  } else {
    sessionStorage.setItem('kc_token', token)
  }
}

export function clearToken() {
  localStorage.removeItem('kc_token')
  sessionStorage.removeItem('kc_token')
}

// Attach the token to every request automatically.
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Convert every failure into a friendly Error with a clean message.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      (error.request && !error.response
        ? 'Network connection lost. Please check your connection.'
        : 'Something went wrong. Please try again.')
    return Promise.reject(new Error(message))
  }
)

export default api