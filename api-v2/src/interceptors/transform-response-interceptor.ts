import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServerDataResponse } from '../../../common/types';

/**
 * Transforms all outgoing data into the ServerResponse shape above.
 */
@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, ServerDataResponse<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ServerDataResponse<T>> {
    return next.handle().pipe(
      map(data => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        data,
      })) as any,
    );
  }
}
