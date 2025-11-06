import express from 'express'
import { userRouter } from './controllers/user.js'
import cors from 'cors'

const app = express()

app.use(cors({ origin: 'http://localhost:3000' }))

app.use(express.json())

// Routes
app.use('/api/user', userRouter)

export default app