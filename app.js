import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import userRouter from './router/user.js';
import videoRouter from './router/video.js'
import { connectDB } from './db.js'; 
import { errorHandler } from './utils/errorHandler.js';



const app = express();
connectDB();
app.use(express.json()); //解析json
app.use(express.urlencoded({ extended: true })) //解析x-www-form-urlencoded
app.use('/uploads',express.static('uploads'))
app.use('/api/user', userRouter);
app.use('/api/video', videoRouter);
app.use(errorHandler); //挂载错误处理

const server = app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

export default app;
