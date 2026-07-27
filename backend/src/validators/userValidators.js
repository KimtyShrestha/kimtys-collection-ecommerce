import { body } from 'express-validator'

export const updateProfileRules = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required.')
    .isLength({ max: 100 }).withMessage('Full name must be 100 characters or fewer.'),
  body('phone')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 20 }).withMessage('Phone number must be 20 characters or fewer.'),
]

export const changePasswordRules = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required.'),
  body('newPassword')
    .notEmpty().withMessage('New password is required.')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters.'),
]

export const addressRules = [
  body('label')
    .trim()
    .notEmpty().withMessage('Label is required.')
    .isLength({ max: 30 }).withMessage('Label must be 30 characters or fewer.'),
  body('recipientName')
    .trim()
    .notEmpty().withMessage('Recipient name is required.')
    .isLength({ max: 100 }).withMessage('Recipient name must be 100 characters or fewer.'),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required.')
    .isLength({ max: 20 }).withMessage('Phone number must be 20 characters or fewer.'),
  body('city')
    .trim()
    .notEmpty().withMessage('City is required.')
    .isLength({ max: 50 }).withMessage('City must be 50 characters or fewer.'),
  body('area')
    .trim()
    .notEmpty().withMessage('Area is required.')
    .isLength({ max: 100 }).withMessage('Area must be 100 characters or fewer.'),
  body('street')
    .optional({ values: 'falsy' }).trim()
    .isLength({ max: 150 }).withMessage('Street must be 150 characters or fewer.'),
  body('landmark')
    .optional({ values: 'falsy' }).trim()
    .isLength({ max: 150 }).withMessage('Landmark must be 150 characters or fewer.'),
  body('isDefault')
    .optional().isBoolean().withMessage('Invalid default flag.'),
]