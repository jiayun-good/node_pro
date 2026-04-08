// middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  // console.error('全局错误 👉', err);
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'token 无效' });
  }
  
  res.status(err.status || 500).json({
    message: err.message || '服务器错误',
  });
};