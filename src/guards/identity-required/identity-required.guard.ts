import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class IdentityRequiredGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    if (!request['user']) {
      throw new UnauthorizedException({
        message: 'Either user identity is not provided or invalid',
        codeName: 'USER_IDENTITY_REQUIRED',
      });
    }

    return true;
  }
}
