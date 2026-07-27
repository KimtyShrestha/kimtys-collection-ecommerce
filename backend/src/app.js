import express from 'express'
import cors from 'cors'
import env from './config/env.js'
import { query } from './config/db.js'
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js'
import { sendSuccess } from './utils/response.js'
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import userRoutes from './routes/userRoutes.js'
import addressRoutes from './routes/addressRoutes.js'
import wishlistRoutes from './routes/wishlistRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

const app = express()

// --- Global middleware ---
app.use(cors({ origin: env.clientUrl }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded product images as static files.
app.use('/uploads', express.static('uploads'))

// --- Health check (now also verifies database connectivity) ---
app.get('/api/health', async (req, res, next) => {
  try {
    const result = await query('SELECT NOW() AS db_time')
    sendSuccess(res, {
      message: 'Kimty\'s Collection API is running.',
      data: {
        environment: env.nodeEnv,
        database: 'connected',
        dbTime: result.rows[0].db_time,
      },
    })
  } catch (error) {
    next(error)
  }
})

// --- API routes (registered here in later phases) ---
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/users', userRoutes)
app.use('/api/addresses', addressRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/admin', adminRoutes)
// app.use('/api/products', productRoutes) Phase 9
// ...

// --- Error handling (must stay last) ---
app.use(notFoundHandler)
app.use(errorHandler)

export default app