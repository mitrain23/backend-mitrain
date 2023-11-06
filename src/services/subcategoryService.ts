import { SubcategoryModel } from '../models/subcategoryModel'
import prisma from '../utils/prisma'

class SubcategoryService {
  static async getAllSubcategories() {
    const subcategories = await prisma.subcategory.findMany({})

    return subcategories
  }

  static async getSubcategoryById(id: string) {
    const getSubcategoryById = await prisma.subcategory.findUnique({
      where: {
        id: id
      }
    })
    return getSubcategoryById
  }

  static async createSubcategory(subcategoryData: SubcategoryModel) {
    const dataInput = {
      subcategoryName: subcategoryData.subcategoryName,
      categoryName: subcategoryData.categoryName
    }
    if (!dataInput) {
      throw Error('Fill all the require data')
    }

    const createdSubcategory = await prisma.subcategory.create({
      data: dataInput
    })

    return createdSubcategory
  }

  static async updateSubcategory(
    subcategoryData: SubcategoryModel,
    id: string
  ) {
    const dataInput = {
      subcategoryName: subcategoryData.subcategoryName,
      categoryName: subcategoryData.categoryName
    }
    const subcategory = await prisma.subcategory.findUnique({
      where: {
        id: id
      }
    })
    if (!subcategory) {
      throw new Error('Cannot find subcategory')
    }
    const updatedSubcategory = await prisma.subcategory.update({
      where: { id: id },
      data: dataInput
    })
    return updatedSubcategory
  }
  static async deleteSubcategory(id: string) {
    const subcategory = await prisma.subcategory.findUnique({
      where: {
        id: id
      }
    })
    if (!subcategory) {
      throw new Error('Cannot find subcategory')
    }

    const deletedSubcategory = await prisma.subcategory.delete({
      where: {
        id: id
      }
    })
    return deletedSubcategory
  }
}

export default SubcategoryService
