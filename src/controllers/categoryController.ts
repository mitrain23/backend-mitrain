import { Request, Response } from 'express'

import CategoryService from '../services/categoryService'

class CategoryController {
  static async getAllCategories(req: Request, res: Response) {
    try {
      const category = await CategoryService.getAllCategories()

      res.status(200).json({ data: category })
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  }

  static async getCategoryById(req: Request, res: Response) {
    const id = req.params.id
    try {
      const getCategoryById = await CategoryService.getCategoryById(id)
      if (!getCategoryById) {
        throw Error('Category not found')
      }
      res.status(200).json({ data: getCategoryById })
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  }

  static async createCategory(req: Request, res: Response) {
    try {
      const categoryName = req.body

      const createdCategory = await CategoryService.createCategory(categoryName)
      res.status(200).json({
        data: createdCategory
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  static async updateCategory(req: Request, res: Response) {
    try {
      const id = req.params.id
      const dataInput = req.body

      const updatedCategory = await CategoryService.updateCategory(
        dataInput,
        id
      )
      res.status(200).json({
        data: updatedCategory
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  static async deleteCategory(req: Request, res: Response) {
    const id = req.params.id
    try {
      const deletedCategory = await CategoryService.deleteCategory(id)
      res.status(200).json({
        data: `Category deleted successfully, ${deletedCategory.id}`
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
}

export default CategoryController
