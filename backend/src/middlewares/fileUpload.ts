import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

export const uploadMiddleware = multer({ storage }).fields([
  { name: 'image', maxCount: 1 },
  { name: 'file', maxCount: 1 } 
]);
