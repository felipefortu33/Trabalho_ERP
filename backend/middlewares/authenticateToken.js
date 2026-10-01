import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';


export const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);

  const [scheme, value] = token.split(' ');
  if (scheme !== 'Bearer' || !value) return res.sendStatus(401);

  jwt.verify(value, env.secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
