import api from './api'

export async function apiRegister(payload) {
  const response = await api.post('/auth/register', payload)
  return response.data.data // { user, token }
}

export async function apiLogin(payload) {
  const response = await api.post('/auth/login', payload)
  return response.data.data // { user, token }
}

export async function apiMe() {
  const response = await api.get('/auth/me')
  return response.data.data.user
}