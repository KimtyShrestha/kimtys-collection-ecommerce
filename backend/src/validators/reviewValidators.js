import { body } from 'express-validator'

export const reviewRules = [
  body('rating')
    .isInt({ min: 1, max: 5 }).withMessage('Please select a rating from 1 to 5 stars.'),
  body('title')
    .optional({ values: 'falsy' }).trim()
    .isLength({ max: 120 }).withMessage('Title must be 120 characters or fewer.'),
  body('comment')
    .optional({ values: 'falsy' }).trim()
    .isLength({ max: 2000 }).withMessage('Comment must be 2000 characters or fewer.'),
]

export const createReviewRules = [
  body('productId').isInt({ min: 1 }).withMessage('Invalid product.'),
  ...reviewRules,
]