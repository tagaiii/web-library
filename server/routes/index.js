import express from 'express'
import userRouter from './userRouter.js'
import bookRouter from './bookRouter.js'

const router = express.Router()

router.use('/users', userRouter)
router.use('/books', bookRouter)

export default router
