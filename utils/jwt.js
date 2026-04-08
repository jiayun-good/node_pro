import jwt from 'jsonwebtoken';
// const secret = process.env.JWT_SECRET;

// const getSecret = () => process.env.JWT_SECRET;
// if (!getSecret) {
//   throw new Error('JWT_SECRET 未配置');
// }
export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
}