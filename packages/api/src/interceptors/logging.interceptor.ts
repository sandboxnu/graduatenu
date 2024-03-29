import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Request, Response } from "express";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

/**
 * NOTE: this was inspired by
 * https://github.com/algoan/nestjs-components/tree/master/packages/logging-interceptor
 */

enum LogType {
  Request,
  Response,
}

/** Interceptor that logs input/output requests */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly ctxPrefix: string = LoggingInterceptor.name;
  private readonly logger: Logger = new Logger();

  /**
   * Intercept method, logs before and after the request being processed
   *
   * @param context Details about the current request
   * @param call$   Implements the handle method that returns an Observable
   */
  public intercept(
    context: ExecutionContext,
    call$: CallHandler
  ): Observable<unknown> {
    const req: Request = context.switchToHttp().getRequest();
    const { method, url, body, headers } = req;
    const ctx = this.formatCtx(LogType.Request, method, url);

    this.logger.log(
      {
        method,
        body,
        headers,
      },
      ctx
    );

    return call$.handle().pipe(
      tap({
        next: (val: unknown): void => {
          this.logNext(val, context);
        },
        error: (err: Error): void => {
          this.logError(err, context);
        },
      })
    );
  }

  /**
   * Logs the request response in success cases
   *
   * @param body    Body returned
   * @param context Details about the current request
   */
  private logNext(body: unknown, context: ExecutionContext): void {
    const req: Request = context.switchToHttp().getRequest<Request>();
    const res: Response = context.switchToHttp().getResponse<Response>();
    const { method, url } = req;
    const { statusCode } = res;
    const ctx = this.formatCtx(LogType.Response, method, url, statusCode);

    this.logger.log({ body }, ctx);
  }

  /**
   * Logs the request response in success cases
   *
   * @param error   Error object
   * @param context Details about the current request
   */
  private logError(error: Error, context: ExecutionContext): void {
    const req: Request = context.switchToHttp().getRequest<Request>();
    const { method, url, body } = req;

    if (error instanceof HttpException) {
      const statusCode: number = error.getStatus();
      const ctx = this.formatCtx(LogType.Response, method, url, statusCode);

      if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
        this.logger.error(
          {
            method,
            url,
            body,
            error,
          },
          error.stack,
          ctx
        );
      } else {
        this.logger.warn(
          {
            method,
            url,
            error,
            body,
          },
          ctx
        );
      }
    } else {
      this.logger.error(
        "Unexpected error occured",
        error.stack,
        this.formatCtx(LogType.Response, method, url)
      );
    }
  }

  private formatCtx(
    logType: LogType,
    method: string,
    url: string,
    statusCode?: number
  ): string {
    const logTypeMessage =
      logType === LogType.Request ? "Incoming request" : "Outgoing response";
    const ctxWithoutStatus = `${this.ctxPrefix} - ${logTypeMessage} - ${method} - ${url}`;
    return statusCode
      ? `${ctxWithoutStatus} - ${statusCode}`
      : ctxWithoutStatus;
  }
}
