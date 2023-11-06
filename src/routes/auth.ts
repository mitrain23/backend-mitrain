import express from 'express';
import AuthController from '../controllers/authController';
import upload from '../utils/multer'

const router = express.Router();

router.post('/registerUser', upload.single('images'), AuthController.registerUser)
router.post(
  '/registerMitra',
  upload.array('images', 5),
  AuthController.registerMitra
)
router.post('/login', AuthController.login)

// status
router.get('', (req, res) => {
  res.status(200).json('api ready')
})

export default router;
