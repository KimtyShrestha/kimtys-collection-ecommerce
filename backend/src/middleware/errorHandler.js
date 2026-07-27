import env from '../config/env.js'
import { ApiError } from '../utils/response.js'

// Handles any route that does not exist.
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: 'The requested resource was not found.',
  })
}

// Central error handler — the ONLY place errors become HTTP responses.
// Must be registered last. The four-argument signature is required by Express.
export function errorHandler(err, req, res, next) {
  // Known, intentionally thrown errors: safe to show their message.
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    })
  }

  // Unknown errors: log the details server-side, never expose them.
  console.error('Unhandled error:', err)

  return res.status(500).json({
    success: false,
    message: env.isDev
      ? `Internal server error: ${err.message}`
      : 'Something went wrong. Please try again.',
  })
}