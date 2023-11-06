import { Image, Post } from '@prisma/client'

export interface MitraModel {
  email: string
  password: string
  name: string
  address: string
  phoneIntWhatsapp: string
  phoneIntContact: string
  categoryName: string
  description: string
  experience: string
  isPremium?: Boolean
  image?: Image[]
  post?: Post[]
}
