import express from 'express'
import PostsController from '../controllers/postsController'
import upload from '../utils/multer'
import { verifyTokenMitra } from '../utils/verifyTokenMitra'

const router = express.Router()

// search filter
//router.get('/search', PostsController.searchQuery)

// get
router.get('/', PostsController.getAllPosts)
router.get('/:id', PostsController.getPostById)
router.get('/postAuthor/:id', verifyTokenMitra, PostsController.getPostByAuthor)

// // post
router.post(
  '/',
  upload.array('images', 5),
  verifyTokenMitra,
  PostsController.createPost
)

//update
router.put(
  '/:id',
  upload.array('images', 5),
  verifyTokenMitra,
  PostsController.updatePost
)

// // delete
router.delete('/:id', verifyTokenMitra, PostsController.deletePost)

// status
router.get('/status1', (req, res) => {
  res.status(200).json('api ready')
})

export default router
