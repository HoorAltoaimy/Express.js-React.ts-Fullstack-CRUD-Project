import axios from 'axios';
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Product } from "./types/dataTypes";

import './App.css';

type Product2 = {
  name: string,
  price: number
}

const App = () => {

  const [products, setProducts] = useState<Product[]>([])

  const [product, setProduct] = useState({
    name: '',
    price: 0
  })

  const [isEdit, setIsEdit] = useState(false)

  const [editId, setEditId] = useState('')

  const fetchProducts = async  () => {
    const {data} = await axios.get('http://localhost:3002/products')
    setProducts(data.payload)
  }

  const handleCreate = async (product: Product2) => {
    try {
      const response = await axios.post('http://localhost:3002/products', product)
      toast.success(response.data.message)
      fetchProducts()
    } catch (error) {
      toast.error(error.response.data.message) 
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(`http://localhost:3002/products/${id}`)
      toast.success(response.data.message)
      fetchProducts()
    } catch (error) {
      toast.error(error.response.data.message)
    }  
  }

  const handleUpdate = async (id: string, name: string, price: number) => {
    setEditId(id)
    setIsEdit(!isEdit)
    if(!isEdit){
      setProduct({
        name: name,
        price: price
      })
    }
    else{
      setProduct({
        name: '',
        price: 0
      })
    }
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target
    setProduct((prevState) => {
      return {...prevState, [name]: value}
    })
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    try {
      if (isEdit) {
        const response = await axios.put(`http://localhost:3002/products/${editId}`, product)
        toast.success(response.data.message)
        fetchProducts()
      }
      else{
        handleCreate(product)
      }
    } catch (error) {
      toast.error(error.response.data.message) 
    }
    
    setProduct({
      name: '',
      price: 0
    })
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div className="body">
      <ToastContainer />
      <form className="product-form" action="POST" onSubmit={handleSubmit}>
        <label htmlFor="name">Product name: </label>
        <input type="text" name="name" placeholder="product name" value={product.name} onChange={handleInputChange} />
        <label htmlFor="name">Product price: </label>
        <input type="number" name="price" placeholder="product price" value={product.price} onChange={handleInputChange} />
        <button className="btn" type="submit">{isEdit ? 'Save' : 'Create'}</button>
      </form>

      <div className="products">
        <table className="products-table">
          <thead>
              <td>Product name</td>
              <td>Product Price</td>
              <td>Edit</td>
              <td>Delete</td>
          </thead>
          {products.length > 0 && products.map((product: Product) => {
            const {id ,name, price} = product
            return <tbody key={id} className="product">
              <tr>
                <td>{name}</td>
                <td>{price}</td>
                <td><button className="btn" onClick={() => {handleUpdate(id, name, price)}}>Update</button></td>
                <td><button className="delete-btn" onClick={() => {handleDelete(id)}}>Delete</button></td>
              </tr>
            </tbody>
          })}
        </table>
      </div>
    </div>
  )
}

export default App
