import multer from 'multer'
import * as path from 'path'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    cb(null, `oshsu-library-${Date.now()}${ext}`)
  },
})

export const upload = multer({ storage: storage })
