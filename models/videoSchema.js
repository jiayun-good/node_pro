import mongoose from 'mongoose';

// 1️⃣ 定义结构（Schema）
const videoSchema = new mongoose.Schema({
   title: {
    type: String,
    required: true,   // 必填
  },
  descrption: {
    type: String,
    required: false,
  },
  vodvideoId: {
    type: String,
    required: true,
  },
  userId: {
    type:mongoose.ObjectId,
    require:true,
    ref:'User' //外键关联的表
  },
  commentCount:{ //评论数量
    type: Number,
    default: 0
  },
  likeCount:{ //点赞
    type: Number,
    default: 0
  },
  dislikeCount:{ //踩
    type: Number,
    default: 0
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
export default mongoose.model('video', videoSchema);
