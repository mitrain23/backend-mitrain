import { PostModel } from '../models/postModel'
import prisma from '../utils/prisma'

class PostService {
  static async getAllPosts(page = 1, pageSize = 10, searchTerm = '') {
    const offset = (page - 1) * pageSize

    const posts = await prisma.post.findMany({
      skip: offset,
      take: pageSize,
      where: {
        title: {
          contains: searchTerm // Filter by title containing the searchTerm
        }
      },
      include: {
        mitra: {
          select: {
            user: {
              select: {
                name: true
              }
            }
          }
        },
        images: { select: { url: true } }
      }
    })

    return posts
  }

  static async getPostById(id: string) {
    const getPostById = await prisma.post.findUnique({
      where: {
        id: id
      },
      include: { images: true, mitra: true }
    })
    return getPostById
  }

  static async getPostByAuthor(mitraId: string) {
    const getPostByAuthor = await prisma.post.findMany({
      where: {
        mitraId
      },
      include: {
        mitra: {
          select: {
            user: {
              select: {
                name: true
              }
            },
          }
        },
        images: { select: { url: true } }
      }
    })
    if (!getPostByAuthor) {
      throw Error('Post not found!')
    }
    return getPostByAuthor
  }

  static async createPost(postData: PostModel, images: any, mitra: string) {
    const {
      title,
      description,
      priceMin,
      priceMax,
      location,
      phoneIntWhatsapp,
      phoneIntContact,
      category
    } = postData
    const image = images.map((file: any) => file.filename)
    const mitraId = mitra
    if (
      !title ||
      !description ||
      !priceMin ||
      !priceMax ||
      !location ||
      !phoneIntWhatsapp ||
      !phoneIntContact
    ) {
      throw Error('Fill all the require data')
    }

    const isMitra = await prisma.user.findUnique({
      where: { id: mitraId, isMitra: true }
    })

    if (!isMitra) {
      throw Error('User is not mitra')
    }

    const createdPost = await prisma.post.create({
      data: {
        title,
        description,
        priceMin,
        priceMax,
        location,
        phoneIntWhatsapp,
        phoneIntContact,
        category,
        mitraId,
        images: {
          createMany: {
            data: image.map((imageUrl: string) => ({
              url: imageUrl
            }))
          }
        }
      },
      include: {
        mitra: {
          select: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        images: {
          select: {
            url: true
          }
        }
      }
    })

    return createdPost
  }

  static async updatePost(
    id: string,
    postData: PostModel,
    images: any,
    mitra: string
  ) {
    const image = images.map((file: any) => file.filename)
    const postDataInput = {
      title: postData.title,
      description: postData.description,
      priceMin: postData.priceMin,
      priceMax: postData.priceMax,
      location: postData.location,
      phoneIntWhatsapp: postData.phoneIntWhatsapp,
      phoneIntContact: postData.phoneIntContact,
      category: postData.category,
      mitraId: mitra,
      isLiked: postData.isLiked || false,
      images: {
        createMany: {
          data: image.map((imageUrl: string) => ({
            url: imageUrl
          }))
        }
      }
    }
    const post = await prisma.post.findUnique({
      where: {
        id: id
      }
    })

    if (!post) {
      throw new Error('Cannot find post')
    }

    if (mitra !== post.mitraId) {
      throw new Error('You are not the owner of post')
    } else {
      const updatedPost = await prisma.post.update({
        where: { id: id },
        data: postDataInput
      })
      return updatedPost
    }
  }

  static async deletePost(id: string, mitra: string) {
    const post = await prisma.post.findUnique({
      where: {
        id: id
      }
    })
    if (!post) {
      throw new Error('Cannot find post')
    }
    if (mitra !== post.mitraId) {
      throw new Error('You are not the owner of post')
    } else {
      const deletedPost = await prisma.post.delete({
        where: {
          id: id
        }
      })
      return deletedPost
    }
  }

  //   static async searchQuery(
  //     searchText: string,
  //     lokasi: string,
  //     minPrice: number | undefined,
  //     maxPrice: number | undefined,
  //     skip: number,
  //     take: number
  //   ) {
  //     const search = searchText || ''
  //     const location = lokasi || ''
  //     const strMinPrice = minPrice !== undefined ? String(minPrice) : undefined
  //     const strMaxPrice = maxPrice !== undefined ? String(maxPrice) : undefined
  //     const skipPage = skip || 0
  //     const takePage = take || 10

  //     try {
  //       let whereClause: any = {}

  //       if (search !== '') {
  //         // Apply search filter if searchText is not empty
  //         whereClause.title = {
  //           contains: search
  //         }
  //       }

  //       if (location !== '') {
  //         // Apply location filter if lokasi is not empty
  //         whereClause.location = {
  //           contains: location
  //         }
  //       }

  //       if (strMinPrice !== undefined) {
  //         // Apply minPrice filter if minPrice is not undefined
  //         whereClause.price_min = {
  //           gte: strMinPrice
  //         }
  //       }

  //       if (strMaxPrice !== undefined) {
  //         // Apply maxPrice filter if maxPrice is not undefined
  //         whereClause.price_max = {
  //           lte: strMaxPrice
  //         }
  //       }

  //       const results = await prisma.post.findMany({
  //         where: whereClause,
  //         include: { author: { select: { name: true } }, image: true },
  //         skip: skipPage,
  //         take: takePage
  //       })

  //       return results
  //     } catch (error) {
  //       // Handle error
  //     }
  //   }
}

export default PostService
