import { Router } from 'express'

import { createProduct, deleteProduct, getAllProducts, getSingleProduct, updateProduct } from '../controllers/productsController.js'
import { createProductValidation, productIdValidation, updateProductValidation } from '../validator/productsValidator.js'
import { runValidation } from '../validator/runValidation.js'

const productsRouter = Router()

//GET: /products -> return all products
productsRouter.get('/', getAllProducts)

//POST: /products -> create a product
productsRouter.post('/', createProductValidation, runValidation, createProduct)

//GET: /products/:id -> git single product
productsRouter.get('/:id', productIdValidation, runValidation, getSingleProduct)

//DELETE: /products/:id -> delete single product
productsRouter.delete('/:id', productIdValidation, runValidation, deleteProduct)

//PUT: /products/:id -> update single product
productsRouter.put('/:id', productIdValidation, updateProductValidation, runValidation, updateProduct)

export default productsRouter
