import express from 'express';
import { register, login,list,upload, subscribe } from '../controller/userController.js'
import { registerValidator } from '../middleware/validator/userValidator.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import multer from 'multer'
const uploads = multer({dest:'uploads/'})
const router = express.Router()
//注册
router.post('/register', registerValidator, register) 
//登录
router.post('/login', login)

// router.use(authMiddleware)
router.get('/list',authMiddleware(),list)
router.post('/upload',authMiddleware(false),uploads.single('file'),upload)
router.get('/subscribe',authMiddleware(),subscribe)
export default router
