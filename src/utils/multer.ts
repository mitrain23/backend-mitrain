import multer from 'multer';

const storage = multer.diskStorage({
  destination: './public/images',
  filename: (req, file, cb) => {
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}-${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}-${now.getSeconds().toString().padStart(2, '0')}`;

    cb(null, timestamp + '_' + file.originalname);
  }
});

const upload = multer({ storage });

export default upload;
