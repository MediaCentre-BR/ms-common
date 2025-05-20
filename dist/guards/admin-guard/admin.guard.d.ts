import { CanActivate } from '@nestjs/common';
import { ValidUserRoles } from '../../types/request-user.types';
export declare function AdminGuard(allowedRoles?: ValidUserRoles[]): CanActivate;
