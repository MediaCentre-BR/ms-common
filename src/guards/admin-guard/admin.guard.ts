import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { RequestUser, ValidUserRoles } from '../../types/request-user.types';

export function AdminGuard(
  allowedRoles: ValidUserRoles[] = [
    ValidUserRoles.ADMIN,
    ValidUserRoles.SUPER_ADMIN,
  ],
): CanActivate {
  @Injectable()
  class UserRoleGuard implements CanActivate {
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      const request = context.switchToHttp().getRequest<Request>();

      const user = request?.['user'] as RequestUser | undefined;

      if (!user) {
        throw new Error('No user data found in request');
      }

      if (!allowedRoles.some((role) => user.userRole === role)) {
        throw new UnauthorizedException({
          message: 'You are not authorized to access this resource',
          codeName: 'USER_ROLE_NOT_AUTHORIZED',
        });
      }

      return true;
    }
  }

  return new UserRoleGuard();
}
