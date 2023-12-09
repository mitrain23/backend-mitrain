import express from 'express'
import userRouter from './userRoute'
import AuthRoute from './auth';
import mitraRouter from './mitraRoute'
import postRouter from './postRoute'
import categoryRouter from './categoryRoute'
import subcategoryRouter from './subcategoryRoute'
import chatRouter from './chatRoute'
import messageRouter from './messageRoutes'

const router = express.Router()
const allRoutes = express()

allRoutes.use('/api/user', userRouter)
allRoutes.use('/api/mitra', mitraRouter)
allRoutes.use('/api/auth', AuthRoute);
allRoutes.use('/api/post', postRouter)
allRoutes.use('/api/category', categoryRouter)
allRoutes.use('/api/subcategory', subcategoryRouter)
allRoutes.use('/api/chat', chatRouter)
allRoutes.use('/api/message', messageRouter)
// status
router.get('', (req, res) => {
  res.status(200).json('api ready')
})

export default allRoutes
