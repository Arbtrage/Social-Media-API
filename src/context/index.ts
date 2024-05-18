import { PrismaClient } from '@prisma/client';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

interface User {
  userId: string
  iat: number
}

export interface Context {
  user?: User
}

export const createContext = ({ req }: { req: Request }): Context => {
  const token = req.headers.authorization?.split(' ')[1];
  let user;
  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as { userId: string, iat: number };
      user = { userId: decoded.userId, iat: decoded.iat };
    } catch (e) {
      console.error(e);
    }
  }
  return {
    user
  };
};
