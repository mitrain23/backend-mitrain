import prisma from '../utils/prisma'
import { MitraModel } from '../models/mitraModel'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
require('dotenv').config()

const salt = 10

class MitraService {
  static async registerMitra(mitraData: MitraModel, images: any) {
    const {
      email,
      password,
      name,
      address,
      phoneIntWhatsapp,
      phoneIntContact,
      categoryName,
      description,
      experience
    } = mitraData
    const image = images.map((file: any) => file.filename)
    console.log(image);
    if (
      !email ||
      !password ||
      !name ||
      !address ||
      !phoneIntWhatsapp ||
      !phoneIntContact ||
      !image ||
      !description ||
      !experience ||
      !categoryName
    ) {
      throw Error('Fill all the require data')
    }

    const existingMitra = await prisma.user.findUnique({
      where: { email: email }
    })

    if (existingMitra) {
      throw Error('User already exists')
    }

    const existingCategory = await prisma.category.findUnique({
      where: { categoryName: categoryName }
    })

    if (!existingCategory) {
      throw Error('Category not exists')
    }

    const hashedPassword = await bcrypt.hash(password, salt)

    const newmitra = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        address,
        phoneIntContact,
        phoneIntWhatsapp,
        Mitra: {
          create: {
            description,
            experience,
            categoryName: existingCategory.categoryName,
          },
        },
        isPremium: false,
        isMitra: true,
        images: {
          createMany: {
            data: image.map((imageUrl: any) => ({
              url: imageUrl,
            }))
          }
        }
      },
    });


    return newmitra
  }

  static async loginMitra(email: string, password: string) {
    // Check if mitra exists
    const mitra = await prisma.user.findUnique({ where: { email } })
    if (!mitra) {
      throw new Error('Invalid credentials')
    }

    // Compare passwords
    const passwordsMatch = await bcrypt.compare(password, mitra.password)
    if (!passwordsMatch) {
      throw new Error('Invalid credentials')
    }

    return mitra
  }

  static async generateToken(mitraId: string | undefined) {
    const token = jwt.sign({ mitraId }, process.env.JWT_SECRET || '', {
      expiresIn: '4h'
    })
    return token
  }

  static async getAllMitra() {
    const mitra = await prisma.user.findMany({
      where: {
        isMitra: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        phoneIntWhatsapp: true,
        phoneIntContact: true,
        isPremium: true,
        isMitra: true,
        images: {
          select: {
            url: true
          }
        },
        Mitra: {
          select: {
            categoryName: true,
            experience: true,
            description: true,
          }
        }
      }
    })
    return mitra
  }
}

export default MitraService
