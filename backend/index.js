import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import {rateLimit} from 'express-rate-limit'

import { dev } from './config/index.js'
import productsRouter from './routes/productsRoutes.js'

const app = express()

const PORT = dev.app.port || 8080

app.listen(PORT, () => {
    console.log(`server is runing at: http://localhost:${PORT}`)
})

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minutes
	limit: 5, // Limit each IP to 5 requests per `window` (here, per 1 minutes).
    message: 'you have reached the maximum requests'
})
// Apply the rate limiting middleware to all routes.
app.use(limiter)

app.use(morgan('dev')) 
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/products', productsRouter) 

app.get('/', (req, res) => {
    res.send('Health checkup')
})

//client error
app.use((req, res, next) => {
    res.status(404).json({message: 'route not found'})
})
//server error
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error'
    })
})
