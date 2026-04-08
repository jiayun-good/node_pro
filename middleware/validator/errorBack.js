import { validationResult } from 'express-validator';
export const errorBack = (req, res, next) => {
  console.log('errorBack', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
}