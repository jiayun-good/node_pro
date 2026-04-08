import { check } from 'express-validator';
import { errorBack } from './errorBack.js';
import User from '../../models/userSchema.js';
export const registerValidator = [
  check('username').custom(async(value) => {
    const user = await User.findOne({ username: value });
    if (user) {
      return Promise.reject('用户名已存在');
    }
    return true;
  }).bail()
  .notEmpty().withMessage('用户名不能为空').bail()
  .isLength({ min: 3 }).withMessage('用户名长度不能小于3位'),
  check('password').notEmpty().withMessage('密码不能为空').bail()
  .isLength({ min: 3 }).withMessage('密码长度不能小于3位'),
  errorBack
]