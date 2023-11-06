import { Mitra, Subcategory } from '@prisma/client'

export interface CategoryModel {
  categoryName: string
  Mitra?: Mitra[]
}
