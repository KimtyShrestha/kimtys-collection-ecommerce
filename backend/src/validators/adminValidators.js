import { body } from 'express-validator'

// Note: product fields arrive as multipart strings, so numeric checks
// run against string input.
export const productRules = [
  body('name').trim().notEmpty().withMessage('Product name is required.')
    .isLength({ max: 150 }).withMessage('Name must be 150 characters or fewer.'),
  body('categoryId').notEmpty().withMessage('Please select a category.')
    .isInt({ min: 1 }).withMessage('Please select a valid category.'),
  body('price').notEmpty().withMessage('Price is required.')
    .isFloat({ gt: 0 }).withMessage('Price must be greater than zero.'),
  body('discountPrice').optional({ values: 'falsy' })
    .isFloat({ gt: 0 }).withMessage('Discount price must be greater than zero.'),
  body('stock').notEmpty().withMessage('Stock is required.')
    .isInt({ min: 0 }).withMessage('Stock cannot be negative.'),
  body('ageGroup').optional()
    .isIn(['0-2', '3-5', '6-9', '10-14', 'all']).withMessage('Invalid age group.'),
  body('description').optional({ values: 'falsy' }).trim()
    .isLength({ max: 5000 }).withMessage('Description is too long.'),
]

export const categoryRules = [
  body('name').trim().notEmpty().withMessage('Category name is required.')
    .isLength({ max: 60 }).withMessage('Name must be 60 characters or fewer.'),
  body('description').optional({ values: 'falsy' }).trim()
    .isLength({ max: 500 }).withMessage('Description must be 500 characters or fewer.'),
  body('sortOrder').optional({ values: 'falsy' })
    .isInt({ min: 0 }).withMessage('Sort order must be zero or greater.'),
]