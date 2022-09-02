import { UserPayload } from './../../interfaces/user.interface';
import { NotAuthorizedError } from './../errors/not-authorized-error';
import { ResMsg } from './../../util/index';
import { ObjectId } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../../models/user';

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload
    }
  }
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'];

  if (!token) throw new NotAuthorizedError('Authorization header not found - Access Restricted!');
  if (process.env.NODE_ENV === "test") return next();
  let decodedToken: UserPayload|null;

  try {
    decodedToken = await jwt.verify(token, process.env.JWT_KEY!) as UserPayload;
  } catch (err) {
    decodedToken = null
  }

  if (!decodedToken) throw new NotAuthorizedError('Expired Token - Access Restricted!');

  const user = await User.findOne({ _id: decodedToken._id });

  if (!user) throw new NotAuthorizedError('Invalid User Account - Access Restricted!');

  req.currentUser = user;

  next();
};