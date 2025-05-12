import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class IdentityRequiredGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
