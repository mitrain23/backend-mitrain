import express from 'express'
import MitraController from '../controllers/mitraController'
import upload from '../utils/multer'

const router = express.Router()

router.get('/', MitraController.getAllMitra)

// status
router.get('/status', (req, res) => {
  res.status(200).json('api ready')
})

export default router
