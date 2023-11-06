import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export const verifyTokenUser = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const token = req.headers['authorization']?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }

  jwt.verify(token, process.env.JWT_SECRET || '', (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' })
    }
    req.body.userId = decoded.userId
    next()
  })
}
