import express from 'express'
import ChatController from '../controllers/chatController';
import { verifyTokenMitra } from '../utils/verifyTokenMitra'
const router = express.Router()


router.post("/",verifyTokenMitra, ChatController.accessChat);
router.get("/",verifyTokenMitra, ChatController.fetchChats);

// status
router.get('/status', (req, res) => {
  res.status(200).json('api ready')
})

export default router
