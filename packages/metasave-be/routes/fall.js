import express from 'express'
import fall from '../controllers/fall/index.js'
import multer from 'multer'
import path, { dirname } from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const privKeyFolder = path.join(__dirname, '../uploads', req.body.username);
      fs.mkdirSync(privKeyFolder, { recursive: true });
      cb(null, privKeyFolder);
    },
    filename: function (req, file, cb) {
      cb(null, 'image.jpg');
    }
});
  
const upload = multer({ storage: storage });

const router = express.Router()

router.post('/fall', upload.single('file'), fall)

export default router