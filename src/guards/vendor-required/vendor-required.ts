import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { RequestUser, ValidUserRoles } from '../../types/request-user.types';


@Injectable()
export class VendorRequired implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const user = request?.['user'] as RequestUser | undefined;

    if (!user) {
      throw new Error('No user data found in request');
    }

    if (user.userRole === ValidUserRoles.SUPER_ADMIN && user.cover === 'sudo') {
      throw new NotAcceptableException({
        message: 'A non sudo target vendor query parameter is required for super admin with sudo cover',
        codeName: 'SUPERADMIN_NO_TARGET_VENDOR',
      })
    }

    return true;
  }
}

