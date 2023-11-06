import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import MitraService from '../services/mitraService'
import { compressImage } from '../utils/compressImage'

class MitraController {

  static async getAllMitra(req: Request, res: Response) {
    try {
      const mitra = await MitraService.getAllMitra()

      res.status(200).json({
        data: mitra
      })
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  }
}

export default MitraController
