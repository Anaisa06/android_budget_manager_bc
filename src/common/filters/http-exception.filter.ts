import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {

    const context = host.switchToHttp();
    const response: Response = context.getResponse();
    const request: Request = context.getRequest();
    const message = exception.getResponse();
    const statusCode = exception.getStatus();

    console.error({
      statusCode,
      path: request.url,
      method: request.method,
      message: typeof message === 'string' ? message: (message as any).message,
      stack: exception.stack
    })

    response.status(statusCode).json({
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: typeof message === 'string' ? message: (message as any).message
    })
  }
}
