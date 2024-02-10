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
      category,
      merchant_name
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

    const existingCategory = await prisma.category.findUnique({
      where: { categoryName: category }
    })

    if (!existingCategory) {
      throw Error('Category not exists')
    }
    console.log(mitra);

    const existingMitra = await prisma.mitra.findUnique({
      where: { id: mitraId },
    });
    
    if (!existingMitra) {
      throw new Error('Invalid mitraId');
    }

    console.log('tes');

    const createdPost = await prisma.post.create({
      data: {
        merchant_name: merchant_name,
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
    postId: string,
    postData: PostModel,
    images: any,
    mitraId: string
  ) {
    try {
      const maxImageCount = 5;

      // Cari post berdasarkan ID
      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
        include: {
          images: true,
        },
      });

      if (!post) {
        return ({ error: 'Post not found' });
      }

      const postDataInput = {
        title: postData.title,
        description: postData.description,
        priceMin: postData.priceMin,
        priceMax: postData.priceMax,
        location: postData.location,
        phoneIntWhatsapp: postData.phoneIntWhatsapp,
        phoneIntContact: postData.phoneIntContact,
        category: postData.category,
        mitraId: post.mitraId,
        isLiked: postData.isLiked || false,
        merchant_name: postData.merchant_name
      }

      const user = await prisma.user.findUnique({
        where: {
          id: mitraId
        }
      })
      
      if (!user) {
        throw new Error('Cannot find user')
      }

      if ( user.id !== post.mitraId) {
        if (!user.isAdmin){
          throw new Error('You are not the owner of post');
        }
      }

      // Filter gambar yang memiliki ID (untuk update)
      const existingImages = images.filter((image: any) => image.id);
      // Filter gambar yang tidak memiliki ID (untuk tambah baru)
      const newImages = images.filter((image: any) => !image.id);

      // Cek ID gambar yang akan diupdate
      const existingImageIds = existingImages.map((image: any) => image.id);
      const invalidImageIds = existingImageIds.filter((imageId: any) => !post.images.some((dbImage) => dbImage.id === imageId));

      if (invalidImageIds.length > 0) {
        return ({ error: 'Invalid image IDs for the post' });
      }

      // Cek jumlah slot gambar
      const availableSlots = maxImageCount - post.images.length;

      // Jika ada slot yang tersedia, cek gambar baru (ID null)
      if (availableSlots > 0 && newImages.length > 0) {
        if (newImages.length > availableSlots) {
          return ({ error: 'Image slots are full. You can only add up to ' + availableSlots + ' new images.' });
        }
      } else if (newImages.length > 0) {
        return ({ error: 'Image slots are full. You cannot add new images.' });
      }

      // Update data post (misalnya title, description, dll.) jika ada dalam postData
      if (postData) {
        const updatedPost = await prisma.post.update({
          where: { id: postId },
          data: postDataInput,
        });
      }

      // Update gambar yang memiliki ID dan menghapus gambar jika URL-nya null atau kosong
      for (const image of existingImages) {
        if (!image.url || image.url.trim() === '') {
          await prisma.image.delete({
            where: { id: image.id },
          });
        } else {
          await prisma.image.update({
            where: { id: image.id },
            data: { url: image.url },
          });
        }
      }

      // Tambahkan gambar baru (ID null)
      if (newImages.length > 0) {
        const createdImages = await prisma.image.createMany({
          data: newImages.map((image: any) => ({
            url: image.url,
            postId: postId,
          })),
        });
      }

      return ({ message: 'Post updated successfully' });
    } catch (error) {
      console.error(error);
      return ({ error: 'Internal server error' });
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
    const user = await prisma.user.findUnique({
      where: {
        id: mitra
      }
    })
    if (!user) {
      throw new Error('Cannot find user')
    }

    if ( user.id !== post.mitraId) {
      if (!user.isAdmin){
        throw new Error('You are not the owner of post');
      }
    }
    
    const deletedPost = await prisma.post.delete({
      where: {
        id: id,
      },
    });

    return deletedPost;
  }

  static async searchQuery(
    searchText: string,
    lokasi: string,
    minPrice: number | undefined,
    maxPrice: number | undefined,
    skip: number,
    take: number,
    merchant_nama: string,
    orderBy: string,
    categoryName: string,
  ) {
    const category_Name = categoryName || ''
    const search = searchText || ''
    const location = lokasi || ''
    const strMinPrice = minPrice !== undefined ? String(minPrice) : undefined
    const strMaxPrice = maxPrice !== undefined ? String(maxPrice) : undefined
    const skipPage = skip || 0
    const takePage = take || 10
    const merchant_name = merchant_nama || ''


    let whereClause: any = {}
    let orderByOption: any = {};

    if (orderBy === 'asc' || orderBy === 'desc') {
      // Apply orderBy filter if valid option is provided
      orderByOption.createdAt = orderBy;
    }

    if (search !== '') {
      // Apply search filter if searchText is not empty
      whereClause.title = {
        contains: search
      }
    }

    if (merchant_name !== '') {
      // Apply location filter if lokasi is not empty
      whereClause.merchant_name = {
        contains: merchant_name
      }
    }

    if (category_Name !== '') {
      // Apply category filter if categoryName is not empty
      whereClause.category = {
        contains: category_Name
      };
    }

    if (location !== '') {
      // Apply location filter if lokasi is not empty
      whereClause.location = {
        contains: location
      }
    }

    if (strMinPrice !== undefined) {
      // Apply minPrice filter if minPrice is not undefined
      whereClause.priceMin = {
        gte: strMinPrice
      }
    }

    if (strMaxPrice !== undefined) {
      // Apply maxPrice filter if maxPrice is not undefined
      whereClause.priceMax = {
        lte: strMaxPrice
      }
    }

    console.log(whereClause);

    const results = await prisma.post.findMany({
      where: whereClause,
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
      },
      orderBy: orderByOption,
      skip: skipPage,
      take: takePage
    })

    return results

  }
}

export default PostService
