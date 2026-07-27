import { validationResult } from 'express-validator'
import { ApiError } from '../utils/response.js'

// Runs after validator chains; converts the first validation
// failure into a clean 400 in our standard envelope.
export function validate(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new ApiError(400, errors.array()[0].msg))
  }
  next()
}