import { Request, Response } from 'express'

import SubcategoryService from '../services/subcategoryService'

class SubcategoryController {
  static async getAllSubcategories(req: Request, res: Response) {
    try {
      const subcategory = await SubcategoryService.getAllSubcategories()

      res.status(200).json({ data: subcategory })
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  }

  static async getSubcategoryById(req: Request, res: Response) {
    const id = req.params.id
    try {
      const getSubcategoryById = await SubcategoryService.getSubcategoryById(id)
      if (!getSubcategoryById) {
        throw Error('Subcategory not found')
      }
      res.status(200).json({ data: getSubcategoryById })
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  }

  static async createSubcategory(req: Request, res: Response) {
    try {
      const dataInput = req.body

      const createdSubcategory = await SubcategoryService.createSubcategory(
        dataInput
      )
      res.status(200).json({
        data: createdSubcategory
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  static async updateSubcategory(req: Request, res: Response) {
    try {
      const id = req.params.id
      const dataInput = req.body

      const updatedSubcategory = await SubcategoryService.updateSubcategory(
        dataInput,
        id
      )
      res.status(200).json({
        data: updatedSubcategory
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  static async deleteSubcategory(req: Request, res: Response) {
    const id = req.params.id
    try {
      const deletedSubcategory = await SubcategoryService.deleteSubcategory(id)
      res.status(200).json({
        data: `Subcategory deleted successfully, ${deletedSubcategory.id}`
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
}

export default SubcategoryController
