import {Request, Response, NextFunction} from 'express';
const fs = require('fs')

function imageUploadMiddleware(req: Request, res: Response, next: NextFunction) {
	let { images } = req.body;

	if (images && Array.isArray(images) && images.length <= 5) {
		req.body.images = uploadImages(images); // Menyimpan hasil unggah gambar dalam request untuk digunakan di rute
		next(); // Lanjutkan ke pemrosesan gambar jika jumlah gambar memenuhi syarat
	} else {
		res.status(400).json({ error: 'Maximum number of images (5) exceeded or invalid format' });
	}
}

// Middleware untuk mengunggah gambar ke folder 'public/images'
function uploadImages(images: any) {
  return images.map((image: any) => {
    if (image.url) {
      if (image.url.split(',')[1]) {
        const base64Data = image.url.split(',')[1];
        const imageBuffer = Buffer.from(base64Data, 'base64');
        const now = new Date();
        const timestamp = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}-${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}-${now.getSeconds().toString().padStart(2, '0')}`;
        const filename = `${timestamp}_${image.id}.jpg`;
        const folder = `public/images/${filename}`;

        // Simpan gambar dalam folder 'public/images'
        fs.writeFileSync(folder, imageBuffer, 'binary');

        image.url = filename;
      } else {
        image.url = image.url || null; // Set nama file ke null jika format base64 tidak valid
      }
    } else {
      // Jika URL kosong atau null, set nama file ke null
      image.url = null;
    }

    return image; // Mengembalikan objek gambar dengan URL yang diperbarui
  });
}


export default imageUploadMiddleware;