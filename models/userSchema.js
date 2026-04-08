import mongoose, { set } from 'mongoose';
import md5 from 'md5';

// 1️⃣ 定义结构（Schema）
const UserSchema = new mongoose.Schema({
   username: {
    type: String,
    required: true,   // 必填
    unique: true      // 唯一
  },
  password: {
    type: String,
    required: true,
    // select: false //查询时不返回密码
  },
  age: {
    type: Number,
    default: 18
  },
  subscribeCount:{
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

export default mongoose.model('User', UserSchema);
