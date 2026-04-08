import mongoose from 'mongoose';

// 1️⃣ 定义结构（Schema）
const subscribeSchema = new mongoose.Schema({
  userId: { //订阅者
    type:mongoose.ObjectId,
    required: true,
    ref:'User'
  },
  chennelId: { //订阅的频道
    type:mongoose.ObjectId,
    require:true,
    ref:'User'
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
export default mongoose.model('subscribe', subscribeSchema);