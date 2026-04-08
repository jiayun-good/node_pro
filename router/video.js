import express from 'express';
import { createVideo,getVideo } from '../controller/videoController.js';
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()
router.post('/create',authMiddleware(),createVideo)
router.get('/getVideo',authMiddleware(false),getVideo)
export default router
