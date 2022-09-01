import { errorResMsg } from './../../util/index';
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return errorResMsg(res, err.statusCode, "error", err.message)
  }

  return errorResMsg(res, 400, "error", 'Something went wrong')
};