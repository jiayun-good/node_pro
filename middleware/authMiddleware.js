// middleware/authMiddleware.js
import { verifyToken } from "../utils/jwt.js";
import { AppError } from "../utils/appError.js";

export const authMiddleware = (require = true) => {
  return (req, res, next) => {
    
    const authHeader = req.headers.authorization;

    if (!authHeader && require) {
      return next(new AppError("未提供 token", 401));
    } else if (authHeader) {
      // Bearer xxx
      const token = authHeader.split(" ")[1];

      if (!token) {
        return next(new AppError("token 格式错误", 401));
      }

      try {
        const decoded = verifyToken(token);

        // 👇 把解析后的用户信息挂到 req 上，后面接口直接用
        req.user = decoded;

        next();
      } catch (err) {
        return next(new AppError("token 无效或已过期", 401));
      }
    }else{
      console.log('非必填');
      
      //require=false token非必传
      next()
    }
  };
};
