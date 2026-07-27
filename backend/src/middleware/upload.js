import multer from 'multer'
import path from 'node:path'
import crypto from 'node:crypto'
import { ApiError } from '../utils/response.js'

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 2 * 1024 * 1024 // 2 MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/products'),
  filename: (req, file, cb) => {
    // Random name prevents collisions and hides original filenames.
    const unique = crypto.randomBytes(8).toString('hex')
    cb(null, `${Date.now()}-${unique}${path.extname(file.originalname).toLowerCase()}`)
  },
})

function fileFilter(req, file, cb) {
  if (!ALLOWED.includes(file.mimetype)) {
    return cb(new ApiError(400, 'Only JPG, PNG and WebP images are allowed.'))
  }
  cb(null, true)
}

export const uploadProductImages = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE, files: 4 },
}).array('images', 4)

// Wraps multer so its own errors become our standard envelope.
export function handleUpload(req, res, next) {
  uploadProductImages(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return next(new ApiError(400, 'Each image must be 2 MB or smaller.'))
      }
      if (error.code === 'LIMIT_FILE_COUNT') {
        return next(new ApiError(400, 'You can upload up to 4 images per product.'))
      }
      return next(new ApiError(400, 'Image upload failed. Please try again.'))
    }
    if (error) return next(error)
    next()
  })
}