import videoModel from "../models/videoSchema.js"
import { asyncHandler } from '../utils/asyncHandler.js';

export const createVideo = asyncHandler(async (req,res) => {
  // console.log(req.body);
  const id = req.user.userId 

  let body = req.body
  body.userId = id
  const video = new videoModel(req.body)
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
  const videoInfo = await videoModel.findById(videoId)
                                    .populate('userId','_id username')
  res.json({videoInfo})
})