import prisma from '../utils/prisma'
import { validationResult } from 'express-validator'
import { UserModel } from '../models/userModel'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { MitraModel } from '../models/mitraModel'
require('dotenv').config()

class UserService {
  static async registerAdmin(userData: any) {
    const {
      email,
      password,
      name,
      address,
      phoneIntWhatsapp,
      phoneIntContact,
      categoryName,
    } = userData

    if (
      !email ||
      !password ||
      !name ||
      !address ||
      !phoneIntWhatsapp ||
      !phoneIntContact
    ) {
      throw Error('Fill all the require data')
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email, isAdmin: true }
    })

    if (existingUser) {
      throw Error('Admin already exists')
    }

    const existingCategory = await prisma.category.findUnique({
      where: { categoryName: categoryName }
    })

    if (!existingCategory) {
      throw Error('Category not exists')
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const newAdmin = await prisma.user.create({
      data: {
        email,
        password: hashPassword,
        name,
        address,
        phoneIntContact,
        phoneIntWhatsapp,
        Mitra: {
          create: {
            description : '',
            experience: '',
            categoryName: existingCategory.categoryName,
          },
        },
        isPremium: true,
        isMitra: true,
        isAdmin: true,
        images: {
          createMany: {
            data: {
              url: ''
            }
          }
        }
      },
    });


    return newAdmin
  }

  static async registerUser(userData: UserModel, images: any) {
    const {
      email,
      password,
      name,
      address,
      phoneIntWhatsapp,
      phoneIntContact
    } = userData
    const imagePath = images ? images.filename : null
    if (
      !email ||
      !password ||
      !name ||
      !address ||
      !phoneIntWhatsapp ||
      !phoneIntContact
    ) {
      throw Error('Fill all the require data')
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    })

    if (existingUser) {
      throw Error('User already exists')
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashPassword,
        name,
        address,
        phoneIntContact,
        phoneIntWhatsapp,
        isPremium: false,
        isMitra: false,
        images: {
          create: {
            url: imagePath
          }
        }
      },
      include: {
        images: {
          select: {
            url: true
          }
        }
      }
    })

    return newUser
  }

  static async loginUser(email: string, password: string) {
    try {
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { email }
      })

      if (!user) {
        throw new Error('User not found')
      }

      // Compare passwords
      const passwordsMatch = await bcrypt.compare(password, user.password)

      if (!passwordsMatch) {
        throw new Error('Incorrect password')
      }

      // If everything is fine, return the user
      return user
    } catch (error: any) {
      console.error('Error during login:', error.message)
      throw new Error('Login failed. Please check your credentials.')
    }
  }

  static async generateToken(userId: string | undefined | number) {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET || '', {
      expiresIn: '4h'
    })
    return token
  }

  static async getAllUser() {
    const users = await prisma.user.findMany({
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
        }
      }
    });

    return users
  }
}

export default UserService
