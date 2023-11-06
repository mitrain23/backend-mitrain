import { Request, Response } from 'express'
import PostService from '../services/postService'

class PostsController {
  static async getAllPosts(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const pageSize = parseInt(req.query.pageSize as string) || 10
      const searchTerm = (req.query.searchTerm as string) || ''

      const posts = await PostService.getAllPosts(page, pageSize, searchTerm)

      res.status(200).json({ data: posts })
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  }

  static async getPostById(req: Request, res: Response) {
    const id = req.params.id
    try {
      const getPostById = await PostService.getPostById(id)
      if (getPostById == null) {
        throw Error('Post not found')
      }
      res.status(200).json({ data: getPostById })
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  }

  static async getPostByAuthor(req: Request, res: Response) {
    const mitraId = req.params.id
    console.log(mitraId)
    try {
      const getPostByAuthor = await PostService.getPostByAuthor(mitraId)
      if (getPostByAuthor == null) {
        throw Error('Post not found')
      }
      res.status(200).json({
        data: getPostByAuthor
      })
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  }

  static async createPost(req: Request, res: Response) {
    try {
      const {
        title,
        description,
        priceMin,
        priceMax,
        location,
        phoneIntWhatsapp,
        phoneIntContact,
        category
      } = req.body
      const postData = {
        title,
        description,
        priceMin,
        priceMax,
        location,
        phoneIntWhatsapp,
        phoneIntContact,
        category
      }
      const images = req.files
      const mitra = req.body.userId

      const createdPost = await PostService.createPost(postData, images, mitra)
      res.status(200).json({
        data: createdPost
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  static async updatePost(req: Request, res: Response) {
    const id = req.params.id
    try {
      const mitra = req.body.userId
      const postData = req.body
      const images = req.files

      const updatedPost = await PostService.updatePost(
        id,
        postData,
        images,
        mitra
      )
      res.status(200).json({
        data: updatedPost
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  static async deletePost(req: Request, res: Response) {
    const id = req.params.id
    const mitra = req.body.mitraId
    try {
      const deletedPost = await PostService.deletePost(id, mitra)
      res.status(200).json({
        data: `post deleted successfully, ${deletedPost.id}`
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
}

export default PostsController
