import express from 'express'
import MessageController from '../controllers/messageController';
import { verifyTokenMitra } from '../utils/verifyTokenMitra'
const router = express.Router()

router.get("/getUnread",verifyTokenMitra, MessageController.unreadMessages);
router.get("/:chatId",verifyTokenMitra, MessageController.allMessages);
router.post("/",verifyTokenMitra, MessageController.sendMessage);

router.put("/:chatId",verifyTokenMitra, MessageController.changeIsRead);

// status
router.get('/status', (req, res) => {
  res.status(200).json('api ready')
})

export default router
