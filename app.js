import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/connectDB.js'
import adminRoutes from './routes/adminRoutes.js'
import userRoutes from './routes/userRoutes.js'
import ECC_Routes from './routes/ECC-Routes.js'
import CSuiteRoutes from './routes/CSuiteRoutes.js'
import foundersFusionRoutes from './routes/foundersFusionRoutes.js'
// import transactionLogRoutes from './routes/transactionLogRoutes.js'

dotenv.config()
const app=express()

const PORT=process.env.PORT || 3000
const DATABASE_URL=process.env.DATABASE_URL

// CORS policy
app.use(cors())

// JSON
app.use(express.json())

// connect database
connectDB(DATABASE_URL)

// LOAD user routes
app.use('/api/admin',adminRoutes)

// LOAD user routes
app.use('/api/user',userRoutes)

// LOAD order routes
app.use('/api/ecc',ECC_Routes)

// LOAD client routes
app.use('/api/c_suite',CSuiteRoutes)

// LOAD order routes
app.use('/api/founders_fusion',foundersFusionRoutes)

// LOAD client routes
// app.use('/api/transaction_log',transactionLogRoutes)


app.listen(PORT,()=>{
    console.log(`listen on PORT: ${PORT}`)
})