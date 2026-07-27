import { body } from 'express-validator'

export const registerRules = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required.')
    .isLength({ max: 100 }).withMessage('Full name must be 100 characters or fewer.'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please enter a valid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
  body('phone')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 20 }).withMessage('Phone number must be 20 characters or fewer.'),
]

export const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please enter a valid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required.'),
]