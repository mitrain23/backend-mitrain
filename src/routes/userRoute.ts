import express from 'express'
import UserController from '../controllers/userController'
import upload from '../utils/multer'

const router = express.Router()
router.get('/profile', UserController.getAllUser)
router.get('/status', (req, res) => {
  res.status(200).json('api ready')
})

export default router
