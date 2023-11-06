import multer from 'multer';
// Multer configuration
const storage = multer.diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {
      cb(null, new Date().getMonth() + 
      new Date().getFullYear() + new Date().getDate() +
      Math.random().toString(35).slice(3) + file.originalname);
    }
  })

const upload = multer({ storage });

export default upload;