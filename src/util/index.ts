import express, { Request, Response } from 'express';
import { ValidationError } from 'express-validator';

interface ResultPayload {
  statusCode: number;
  status: string;
  message: string;
  data?: any
}

/**
 * Send Response
 * @param {object} res express response Object
 * @param {number} statusCode HTTP status code
 * @param {string} status Status type ('success'||''error')
 * @param {string} message info to the user
 * @param {object} data object of data for user
 */
export const ResMsg = (res: Response, statusCode = 200, status: string, message: string, data = {}) => {
  res.status(statusCode).json({
    status,
    message,
    data,
  });
};

export const errorResMsg = (res: Response, statusCode = 200, status: string, message: string) => {
  res.status(statusCode).json({
    status,
    message
  });
};

/**
 * Send Response
 * @param {object} res express response Object
 * @param {object} result result object
 */
export const resultResMsg = (res: Response, result: ResultPayload) => {
  const { statusCode, status, message, data = {} } = result;
  return ResMsg(res, statusCode, status, message, data)
};

export const BadRequestError = (res: Response, errors: ValidationError[]) => {
  let data = errors.map(err => {
    return { message: err.msg, field: err.param };
  });
  return ResMsg(res, 400, 'error', 'Bad Request', data);
};
