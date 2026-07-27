import { body } from 'express-validator'

export const createOrderRules = [
  body('items')
    .isArray({ min: 1 }).withMessage('Your cart is empty.'),
  body('items.*.productId')
    .isInt({ min: 1 }).withMessage('Invalid product in cart.'),
  body('items.*.quantity')
    .isInt({ min: 1, max: 99 }).withMessage('Invalid quantity in cart.'),
  body('paymentMethod')
    .isIn(['cod', 'esewa', 'khalti']).withMessage('Please select a valid payment method.'),
  body('shipping.name')
    .trim().notEmpty().withMessage('Recipient name is required.')
    .isLength({ max: 100 }).withMessage('Recipient name must be 100 characters or fewer.'),
  body('shipping.phone')
    .trim().notEmpty().withMessage('Phone number is required.')
    .isLength({ max: 20 }).withMessage('Phone number must be 20 characters or fewer.'),
  body('shipping.city')
    .trim().notEmpty().withMessage('City is required.')
    .isLength({ max: 50 }).withMessage('City must be 50 characters or fewer.'),
  body('shipping.area')
    .trim().notEmpty().withMessage('Area is required.')
    .isLength({ max: 100 }).withMessage('Area must be 100 characters or fewer.'),
  body('shipping.street')
    .optional({ values: 'falsy' }).trim()
    .isLength({ max: 150 }).withMessage('Street must be 150 characters or fewer.'),
  body('shipping.landmark')
    .optional({ values: 'falsy' }).trim()
    .isLength({ max: 150 }).withMessage('Landmark must be 150 characters or fewer.'),
]