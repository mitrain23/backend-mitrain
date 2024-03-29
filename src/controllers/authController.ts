import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import UserService from '../services/userService'
import { compressImage } from '../utils/compressImage'
import MitraService from '../services/mitraService'

class AuthController {
  static async registerAdmin(req: Request, res: Response): Promise<any> {
    try {
      const {
        email,
        password,
        name,
        address,
        phoneIntWhatsapp,
        phoneIntContact,
        categoryName
      } = req.body

      const userData = {
        email,
        password,
        name,
        address,
        phoneIntWhatsapp,
        phoneIntContact,
        categoryName,
      }

      const newUser = await UserService.registerAdmin(userData)

      res.status(200).json({
        data: newUser
      })
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  }

  static async registerUser(req: Request, res: Response): Promise<any> {
    try {
      const {
        email,
        password,
        name,
        address,
        phoneIntWhatsapp,
        phoneIntContact
      } = req.body
      const images = req.file || null
      const userData = {
        email,
        password,
        name,
        address,
        phoneIntWhatsapp,
        phoneIntContact
      }
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const compressedImage = await compressImage(images)

      console.log({ compressedImage })
      const newUser = await UserService.registerUser(userData, images)

      res.status(200).json({
        data: newUser
      })
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  }

  static async login(req: Request, res: Response) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const { email, password } = req.body
      const user = await UserService.loginUser(email, password)

      const token = await UserService.generateToken(user.id)

      res.status(200).json({
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          isMitra: user.isMitra
        },
        token
      })
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  }

  static async registerMitra(req: Request, res: Response): Promise<any> {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    try {
      const {
        email,
        password,
        name,
        address,
        phoneIntWhatsapp,
        phoneIntContact,
        categoryName,
        experience,
        description
      } = req.body
      const images = req.files as Express.Multer.File[]
      const mitraData = {
        email,
        password,
        name,
        address,
        phoneIntWhatsapp,
        phoneIntContact,
        categoryName,
        experience,
        description
      }
      // console.log(images)
      const compressedImages = await Promise.all(images.map(compressImage))

      const newMitra = await MitraService.registerMitra(mitraData, images)

      res.status(200).json({
        data: newMitra
      })
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  }

}
export default AuthController


