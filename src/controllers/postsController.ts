import { Request, Response } from 'express'
import PostService from '../services/postService'
import { PostModel } from '../models/postModel'
import prisma from '../utils/prisma'
const fs = require('fs')

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
        category,
        merchant_name,
        experience
      } = req.body
      const postData = {
        title,
        description,
        priceMin,
        priceMax,
        location,
        phoneIntWhatsapp,
        phoneIntContact,
        category,
        merchant_name,
        experience
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
      const images = req.body.images

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

  // static async updatePost(req: Request, res: Response) {
  //   const productId = parseInt(req.params.productId);
  //   const { nama, deskripsi } = req.body;
  //   const imageFiles = req.files;

  //   try {
  //     // Temukan produk berdasarkan ID
  //     const existingProduct = await prisma.product.findUnique({
  //       where: {
  //         id: productId,
  //       },
  //       include: {
  //         images: true,
  //       },
  //     });

  //     if (!existingProduct) {
  //       return res.status(404).json({ error: 'Product not found' });
  //     }

  //     // Update product fields (nama dan deskripsi)
  //     const updatedProduct = await prisma.product.update({
  //       where: {
  //         id: productId,
  //       },
  //       data: {
  //         nama,
  //         deskripsi,
  //       },
  //       include: {
  //         images: true,
  //       },
  //     });

  //     // Proses gambar yang diunggah
  //     if (imageFiles) {
  //       const updatedImages = [];

  //       for (const file of imageFiles) {
  //         const imageId = /* Ambil ID gambar dari permintaan */;
  //         const existingImage = existingProduct.images.find((image) => image.id === imageId);

  //         if (existingImage) {
  //           // Gambar sudah ada dalam produk, perbarui URL
  //           await prisma.image.update({
  //             where: {
  //               id: imageId,
  //             },
  //             data: {
  //               url: `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
  //             },
  //           });

  //           updatedImages.push({ id: imageId, url: `data:${file.mimetype};base64,${file.buffer.toString('base64')}` });
  //         } else {
  //           // ID gambar tidak sesuai dengan gambar dalam produk
  //           return res.status(400).json({ error: 'Invalid image ID' });
  //         }
  //       }

  //       // Anda dapat menangani gambar yang tidak diperbarui atau dihapus sesuai dengan kebutuhan
  //     }

  //     res.json(updatedProduct);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: 'Could not update the product.' });
  //   }
  // }

  static async deletePost(req: Request, res: Response) {
    const id = req.params.id
    const mitra = req.body.userId
    try {
      const deletedPost = await PostService.deletePost(id, mitra)
      res.status(200).json({
        data: `post deleted successfully, ${deletedPost.id}`
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  static async searchQuery(req: Request, res: Response) {
    try {
      const orderBy = req.query.orderBy as string;
      const categoryName = req.query.categoryName as string;
      const searchText = req.query.searchText as string;
      const lokasi = req.query.lokasi as string;
      const merchant_name = req.query.merchant_name as string;
      const minPrice = parseInt(req.query.minPrice as string) || undefined;
      const maxPrice = parseInt(req.query.maxPrice as string) || undefined;
      const skip = parseInt(req.query.skip as string) || 0;
      const take = parseInt(req.query.take as string) || 10;

      const searchResults = await PostService.searchQuery(searchText, lokasi, minPrice, maxPrice, skip, take, merchant_name, orderBy, categoryName);

      res.json(searchResults);
    } catch (error: any) {
      console.error('Error:', error);
      res.status(500).json({ error: error.message })
    }
  }
}

export default PostsController
