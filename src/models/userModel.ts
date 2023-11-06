import { Image } from '@prisma/client'

export interface UserModel {
  email: string
  password: string
  name: string
  address: string
  phoneIntWhatsapp: string
  phoneIntContact: string
  images?: Image
}
