import { Image } from '@prisma/client'

export interface PostModel {
  title: string
  description: string
  priceMin: string
  priceMax: string
  location: string
  phoneIntWhatsapp: string
  phoneIntContact: string
  category: string
  experience: string
  merchant_name: string
  isLiked?: boolean
  image?: Image[]
}
