// Standard API response envelope used by every endpoint.
// Success: { success: true,  message, data }
// Error:   { success: false, message }

export function sendSuccess(res, { statusCode = 200, message = 'OK', data = null }) {
  const body = { success: true, message }
  if (data !== null) body.data = data
  return res.status(statusCode).json(body)
}

export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message)
    this.statusCode = statusCode
  }
}