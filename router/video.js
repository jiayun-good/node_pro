import express from 'express';
import { createVideo,getVideo, comment, commentList, delComment, reactions, getLikeList } from '../controller/videoController.js';
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()
router.post('/create',authMiddleware(),createVideo)
router.get('/getVideo',authMiddleware(false),getVideo)
// 视频评论相关
router.post('/comment',authMiddleware(),comment)
router.get('/comment/:videoId',authMiddleware(),commentList)
router.delete('/comment/:commentId',authMiddleware(),delComment)
//点赞/踩
router.post('/:videoId/reactions',authMiddleware(),reactions)
//登录喜欢的列表
router.get('/likeList',authMiddleware(),getLikeList)
export default router
