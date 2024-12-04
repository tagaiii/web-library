import express from 'express'
import {
  userRegistration,
  userLogin,
  userAuth,
  getUsersByRole,
} from '../controllers/userController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import { upload } from '../middleware/multerMiddleware.js'

const router = express.Router()

router.post('/registration', upload.single('avatar'), userRegistration)
router.post('/login', userLogin)
router.get('/auth', authMiddleware, userAuth)
router.get('/readers', getUsersByRole('READER'))
router.get('/librarians', getUsersByRole('LIBRARIAN'))

export default router
