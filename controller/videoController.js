import videoCommentSchema from "../models/videoCommentSchema.js";
import reactionSchema from "../models/reactionSchema.js";
import videoSchema from "../models/videoSchema.js"
import { asyncHandler } from '../utils/asyncHandler.js';

export const createVideo = asyncHandler(async (req,res) => {
  // console.log(req.body);
  const id = req.user.userId 

  let body = req.body
  body.userId = id
  const video = new videoSchema(req.body)
  await video.save()

  res.json({
    message: '创建成功',
  });

})

//获取视频详情
export const getVideo = asyncHandler(async(req,res)=>{
  
  
  const { videoId } = req.query
  // console.log(req.query);
  // populate - 把 userId 这个“外键”替换成对应的用户完整信息
  const videoInfo = await videoSchema.findById(videoId)
                                    .populate('userId','_id username')
  res.json({videoInfo})
})

//视频评论
export const comment =asyncHandler( async(req,res) => {
  const userId = req.user.userId
  const { videoId,comment } = req.body
  
  //视频评论数+1
  const video = await videoSchema.findById(videoId)
  video.commentCount++
  await video.save()
  //存入视频评论集合
  const videoComment = await videoCommentSchema.create({userId,videoId,comment})
  res.json(videoComment)
})

//获取视频评论列表
export const commentList = asyncHandler( async(req,res) => {

  const {videoId} = req.params
  const videoCommentList = await videoCommentSchema.find({videoId})
  res.json(videoCommentList)
})

//删除视频评论
export const delComment = asyncHandler( async(req,res) => {

  const {commentId} = req.params
  console.log(commentId);
  
  const videoComment = await videoCommentSchema.findById(commentId)
  if(!videoComment) return res.status(404).json({message:'评论不存在或无权限'})
  //删除评论
  await videoComment.deleteOne()
  //对应的视频下评论数量-1
  const video = await videoSchema.findById(videoComment.videoId)
  video.commentCount--
  await video.save()
  res.json({message:'删除成功'})
})

//视频-点赞/踩
export const reactions = asyncHandler( async(req,res) => {
  const {type} = req.body
  const {videoId} = req.params
  const userId = req.user.userId
  if(!['like','dislike'].includes(type)) return res.status(400).json({message:'参数错误'})

  //1。新增还是修改
  const existing  = await reactionSchema.findOne({videoId,userId})
  //2.//新增
  if(!existing){
    
    await reactionSchema.create({
      userId,
      videoId,
      type
    })
    //更新视频统计数量
    if(type === 'like'){
      await videoSchema.findByIdAndUpdate(videoId,{ $inc: { likeCount: 1 } })
    }else{
      await videoSchema.findByIdAndUpdate(videoId,{ $inc: { dislikeCount: 1 } })
    }
    return res.json({message:'操作成功'})
  }

  //3.已经点了同样的 → 再点一次 = 取消
  if(type === existing.type){
    await existing.deleteOne()
    if(type === 'like'){
      await videoSchema.findByIdAndUpdate(videoId,{ $inc: { likeCount: -1 } })
    }else{
      await videoSchema.findByIdAndUpdate(videoId,{ $inc: { dislikeCount: -1 } })
    }
    return res.json({ message: '已取消' })
  }

  //4.点的不一样，更新
  const oldType = existing.type
  existing.type = type
  await existing.save()
  await videoSchema.findByIdAndUpdate(videoId,{ $inc: { 
    likeCount:type === 'like'? 1 : -1,
    dislikeCount:type === 'dislike'? 1 : -1
   } })
   return res.json({ message: '已切换' })
  
})

//点赞（喜欢）的视频列表
export const getLikeList = asyncHandler(async(req,res)=>{
  const userId = req.user.userId
  const likeList = await reactionSchema.find({userId})
  res.json(likeList)
})