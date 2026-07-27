import api from './api'

export async function apiGetDashboard() {
  const response = await api.get('/admin/dashboard')
  return response.data.data
}