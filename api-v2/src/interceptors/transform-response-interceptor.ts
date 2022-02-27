import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ServerResponse<T> {
  data: T;
}

/**
 * Transforms all outgoing data into the ServerResponse shape above.
 */
@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, ServerResponse<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ServerResponse<T>> {
    return next.handle().pipe(
      map(data => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        data,
      })) as any,
    );
  }
}
