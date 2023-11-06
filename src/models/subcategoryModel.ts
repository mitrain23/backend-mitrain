import { Category } from '@prisma/client'

export interface SubcategoryModel {
  subcategoryName: string
  categoryName: string
  category?: Category[]
}
