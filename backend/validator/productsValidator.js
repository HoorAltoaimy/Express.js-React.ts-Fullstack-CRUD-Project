import {check} from 'express-validator'

export const createProductValidation = [
    check('name')
        .trim()
        .notEmpty()
        .withMessage('name is missing')
        .isLength({min: 2, max: 50})
        .withMessage('product name must be 2-50 characters'),
    check('price')
        .trim()
        .notEmpty()
        .withMessage('price is missing')
        .isFloat({min: 1})
        .withMessage('price must be grater tha zero')  
]

export const updateProductValidation = [
    check('name')
        .optional()
        .trim()
        .isLength({min: 2})
        .withMessage('product name must be at least 2 characters'),
    check('price')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('price is missing')
        .isFloat({min: 1})
        .withMessage('price must be grater tha zero')  
]


export const productIdValidation = [
    check('id').isNumeric().withMessage('product id must be number')
]


