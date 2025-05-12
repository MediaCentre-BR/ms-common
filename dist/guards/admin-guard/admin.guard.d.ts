import { CanActivate } from '@nestjs/common';
import { ValidUserRoles } from '../../utils/request-user.types';
export declare function AdminGuard(allowedRoles?: ValidUserRoles[]): CanActivate;
