import mongoose from 'mongoose';


// 1️⃣ 定义结构（Schema）
const reactionSchema = new mongoose.Schema({
  userId: { //评论者
    type:mongoose.ObjectId,
    required: true,
    ref:'User'
  },
  videoId: { //评论的视频
    type:mongoose.ObjectId,
    require:true,
    ref:'video'
  },
  type:{
    type: String,
    enum:['dislike','like'],
    require:true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
});
//导出并生成 Model
export default mongoose.model('reaction', reactionSchema);