import { CategoryModel } from '../models/categoryModel'
import prisma from '../utils/prisma'

class CategoryService {
  static async getAllCategories() {
    const categories = await prisma.category.findMany({
      include: {
        Subcategory: {
          select: {
            subcategoryName: true
          }
        }
      }
    })

    return categories
  }

  static async getCategoryById(id: string) {
    const getCategoryById = await prisma.category.findUnique({
      include: {
        Subcategory: {
          select: {
            subcategoryName: true
          }
        }
      },
      where: {
        id: id
      }
    })
    return getCategoryById
  }

  static async createCategory(categoryData: any) {
    console.log(categoryData.categoryName)
    

    const createdCategory = await prisma.category.create({
      data: {
        categoryName: categoryData.categoryName
      }
    })

    return createdCategory
  }

  static async updateCategory(categoryData: CategoryModel, id: string) {
    const dataInput = {
      categoryName: categoryData.categoryName
    }
    const category = await prisma.category.findUnique({
      where: {
        id: id
      }
    })
    if (!category) {
      throw new Error('Cannot find category')
    }
    const updatedCategory = await prisma.category.update({
      where: { id: id },
      data: dataInput
    })
    return updatedCategory
  }
  static async deleteCategory(id: string) {
    const category = await prisma.category.findUnique({
      where: {
        id: id
      }
    })
    if (!category) {
      throw new Error('Cannot find category')
    }

    const deletedCategory = await prisma.category.delete({
      where: {
        id: id
      }
    })
    return deletedCategory
  }
}

export default CategoryService
