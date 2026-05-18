import { Response } from 'express';
import { ApiResponseBody, PaginationMeta } from '../interfaces';

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message = 'Success',
    statusCode = 200,
    pagination?: PaginationMeta
  ): Response {
    const response: ApiResponseBody<T> = {
      success: true,
      message,
      data,
    };

    if (pagination) {
      response.pagination = pagination;
    }

    return res.status(statusCode).json(response);
  }

  static created<T>(res: Response, data: T, message = 'Created successfully'): Response {
    return ApiResponse.success(res, data, message, 201);
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }

  static error(
    res: Response,
    message: string,
    statusCode = 500,
    errors: unknown[] = []
  ): Response {
    const response: ApiResponseBody = {
      success: false,
      message,
      errors: errors.length > 0 ? errors : undefined,
    };

    return res.status(statusCode).json(response);
  }
}
