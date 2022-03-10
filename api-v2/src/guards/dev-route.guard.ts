import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * Guards dev routes so that they are not accessible in production.
 */
@Injectable()
export class DevRouteGuard implements CanActivate {
  canActivate(
    _context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return process.env.NODE_ENV !== 'production';
  }
}
