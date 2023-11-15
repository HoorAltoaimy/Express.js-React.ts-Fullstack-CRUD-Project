import fs from 'fs/promises'

import { findItemById } from "../services/productService.js"

let products = JSON.parse(await fs.readFile('products.json', 'utf-8'))

const successResponse = (res, statusCode = 200, message = 'successful', payload = {}) => { //payload refers to the data we send (the name can be anything)
    res.status(statusCode).send({
      message, message,
      payload: payload
    })
}

export const getAllProducts = async (req, res, next) => {
    try {
        const maxPrice = req.query.maxPrice
        if(maxPrice){
            const filteredProducts = products.filter((product) => product.price <= maxPrice)
            successResponse(res, 200, `Products with ${maxPrice} or less`, filteredProducts)
        }
        else{
            successResponse(res, 200, 'all product are rendered', products)
        }
    } catch (error) {
        next(error)
    }
}

export const createProduct =  async (req, res, next) => { 
    try {
        const {name, price} = req.body
        const newProduct = {
            id: new Date().getTime().toString(),
            name,
            price
        }
        products.push(newProduct)
        await fs.writeFile('products.json', JSON.stringify(products))
        successResponse(res, 200, 'New product is created', newProduct)
    } catch (error) {
        next(error)
    }
}

export const getSingleProduct = async (req, res, next) => {
    try {
        const id = req.params.id
        const product = findItemById(req.params.id, products) //instead of the previous line, just to make things modular and organized (reusable code)
        if(product){
            successResponse(res, 200, 'single product is rendered', product)
        }
        else{
            const error = new Error(`no product found with this id ${id}`)
            error.status = 404
            throw error
        }   
    } catch (error) {
        next(error)
    }
}

export const deleteProduct = async (req, res, next) => {
    try {
        const id = req.params.id
        const product = products.find((product) => product.id === id)
        if(product){
            const filteredProducts = products.filter((product) => product.id !== id)
            products = filteredProducts
            await fs.writeFile('products.json', JSON.stringify(products))
            successResponse(res, 200, `Product ${id} is deleted`, filteredProducts)
        }
        else{
            const error = new Error(`no product found with this id ${id}`)
            error.status = 404
            throw error        
        }
    } catch (error) {
        next(error)
    } 
}

export const updateProduct = async (req, res, next) => { 
    try {
        const id = req.params.id
        const index = products.findIndex((product) => product.id === id)
        const {name, price} = req.body
        if(index > -1){
            if(name){
                products[index].name = name 
            }
            if(price){
                products[index].price = price 
            }
            await fs.writeFile('products.json', JSON.stringify(products))
            successResponse(res, 200, `Product ${id} is updated`, products[index])
        }
        else{
            const error = new Error(`no product found with this id ${id}`)
            error.status = 404
            throw error
        }
    } catch (error) {
        next(error)
    }
}
