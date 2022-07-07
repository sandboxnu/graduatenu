import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

type HTTPExceptionResponse = {
  statusCode: number;
  message: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let status: HttpStatus;
    let error: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      // response can either be an object or a string 
      const errorRes = exception.getResponse();
      error = (errorRes as HTTPExceptionResponse).message || exception.message;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      error = 'Critical internal server error occured!';
    }

    const errorResponse = {
      status, 
      error,
      path: req.url,
      method: req.method,
      timeStamp: new Date().toISOString(),
      stack: exception.stack
    }

    console.log(errorResponse)
    res.status(status).json({ status, error });
  }
}