import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import UserService from '../services/userService'
import { compressImage } from '../utils/compressImage'

class UserController {
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

  static async loginUser(req: Request, res: Response) {
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

  static async getAllUser(req: Request, res: Response) {
    try {
      const user = await UserService.getAllUser()

      res.status(200).json({
        data: user
      })
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  }
}

export default UserController
