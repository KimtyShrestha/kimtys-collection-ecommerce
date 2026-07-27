import express from 'express'
import cors from 'cors'
import env from './config/env.js'
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js'
import { sendSuccess } from './utils/response.js'

const app = express()

// --- Global middleware ---
app.use(cors({ origin: env.clientUrl }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded product images as static files.
app.use('/uploads', express.static('uploads'))

// --- Health check ---
app.get('/api/health', (req, res) => {
  sendSuccess(res, {
    message: 'Kimty\'s Collection API is running.',
    data: {
      environment: env.nodeEnv,
      timestamp: new Date().toISOString(),
    },
  })
})

// --- API routes (registered here in later phases) ---
// app.use('/api/auth', authRoutes)        Phase 6
// app.use('/api/products', productRoutes) Phase 9
// ...

// --- Error handling (must stay last) ---
app.use(notFoundHandler)
app.use(errorHandler)

export default app