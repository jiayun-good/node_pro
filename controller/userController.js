import User from '../models/userSchema.js';
import {generateToken} from '../utils/jwt.js'
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';
import md5 from 'md5';
// import fs from 'fs'
// import { promisify } from 'util';
// const rname = promisify(fs.rename)
import fs from 'fs/promises'
import path from 'path'
import subscribeSchema from '../models/subscribeSchema.js';

export const register = async (req, res) => {

  
    const { username, password } = req.body;
    const user = await User.create({ username, password:md5(String(password)) });
    res.json({ message: '注册成功', data: user });
};

export const login = asyncHandler(async(req, res) => {
  
  const { username, password } = req.body;
  
  // 1️⃣ 查用户
    const user = await User.findOne({ username });

    if (!user) {
      // return res.json({ message: '用户不存在' });
      throw new AppError('用户不存在', 404);
    }

    
    // 2️⃣ 校验密码
    if (user.password !== md5(password)) {
      // return res.json({ message: '密码错误' });
      throw new AppError('密码错误', 400);
    }
    const token = generateToken(user._id);
    console.log('user',user);
    
    res.json({
      message: '登录成功',
      data: user,
      token
    });
})

export const list = asyncHandler((req,res) => {


  res.json({
    data:req.user
  })
})

export const upload = asyncHandler(async(req,res)=>{
  const { file } = req
  if (!file) {
    throw new AppError('请上传文件', 400)
  }

  const ext = path.extname(file.originalname)
  const filename  = file.filename + ext

  //重写文件名
  await fs.rename('./uploads/'+file.filename , './uploads/'+filename)
  res.json({filename:filename})
})

//订阅
export const subscribe = asyncHandler(async(req,res)=>{
  const { chennelId } = req.query
  const userId = req.user.userId

  if(userId === chennelId) return res.json({message:'不能关注自己'})

  const subscribe = await subscribeSchema.findOne({userId,chennelId})
  if(subscribe){
    //已经关注过了
    res.status(401).json({message:'已经关注过了'})
  }else{
    const user = User.findById(chennelId)
    //给被关注的用户粉丝数加1
    user.subscribeCount++
    await subscribeSchema.create({userId,chennelId})
    res.json({message:'关注成功！'})
  }
})