import api from './api'

export async function apiPlaceOrder(payload) {
  const response = await api.post('/orders', payload)
  return response.data.data.order
}

export async function apiGetOrder(orderNumber) {
  const response = await api.get(`/orders/${orderNumber}`)
  return response.data.data.order
}