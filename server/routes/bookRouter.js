import express from 'express'

import {
  addBook,
  deleteBook,
  getBookByTitle,
  getBooks,
  editBook,
  assignBook,
  returnBook,
} from '../controllers/bookController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import { upload } from '../middleware/multerMiddleware.js'
import { roleCheck } from '../middleware/roleCheck.js'

const router = express.Router()

router.get('/', getBooks)
router.get('/search', getBookByTitle)
router.post(
  '/add',
  authMiddleware,
  roleCheck(['LIBRARIAN']),
  upload.single('cover_image'),
  addBook
)
router.patch(
  '/:id',
  authMiddleware,
  roleCheck(['LIBRARIAN']),
  upload.single('cover_image'),
  editBook
)
router.post('/:id', authMiddleware, roleCheck(['LIBRARIAN']), deleteBook)
router.post('/:id/assign', authMiddleware, roleCheck(['LIBRARIAN']), assignBook)
router.post('/:id/return', authMiddleware, roleCheck(['LIBRARIAN']), returnBook)

export default router
