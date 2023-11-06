import path from 'path'
import sharp from 'sharp'
import fs from 'fs'

// Fungsi untuk mengompres dan menyimpan gambar
export async function compressImage(image: any) {
  if (!image) {
    return null
  }
  let path = image.path
  const compressedImageBuffer = await sharp(path)
    .resize({ width: 300, height: 300 }) // Sesuaikan ukuran yang Anda inginkan
    .jpeg({ quality: 80 }) // Ubah ke format dan kualitas yang Anda inginkan
    .toBuffer()
  fs.writeFileSync(path, compressedImageBuffer)
  // Mengembalikan gambar yang sudah terkompres
  return path
}
