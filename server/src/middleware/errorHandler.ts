import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let error = err;

  // Log error in development
  if (env.NODE_ENV === 'development') {
    console.error('❌ Error:', err);
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const mongoErr = err as unknown as { errors: Record<string, { message: string }> };
    const messages = Object.values(mongoErr.errors).map((val) => val.message);
    error = ApiError.badRequest('Validation Error', messages);
  }

  // Handle Mongoose duplicate key errors
  const errWithCode = err as unknown as Record<string, unknown>;
  if (errWithCode.code === 11000) {
    const errWithKeyValue = errWithCode as { keyValue: Record<string, unknown> };
    const field = Object.keys(errWithKeyValue.keyValue)[0];
    error = ApiError.conflict(`${field} already exists`);
  }

  // Handle Mongoose cast errors (invalid ObjectId)
  if (err.name === 'CastError') {
    error = ApiError.badRequest('Invalid ID format');
  }

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors.length > 0 ? error.errors : undefined,
      ...(env.NODE_ENV === 'development' && { stack: error.stack }),
    });
    return;
  }

  // Unhandled errors
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    ...(env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};
