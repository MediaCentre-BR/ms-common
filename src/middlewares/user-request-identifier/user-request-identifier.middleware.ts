import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidUserRoles } from '../../types/request-user.types';

@Injectable()
export class UserRequestIdentifierMiddleware implements NestMiddleware {
  private readonly _VALID_USER_ROLES = Object.values(ValidUserRoles);

  use(req: Request, res: Response, next: () => void): void {
    const userId = req.headers['x-user-id'];
    const accountId = req.headers['x-account-id'];
    const isAccountAdmin = req.headers['x-is-account-admin'];
    const userRole = req.headers['x-user-role'];
    const cover = req.headers['x-cover'];

    if (
      this._validateUserData(userId, accountId, userRole, isAccountAdmin, cover)
    ) {
      req['user'] = {
        userId: userId as string,
        userRole: userRole as string,
        cover: cover as string,
        userAccountId: accountId ? (accountId as string) : null,
        isAccountAdmin: isAccountAdmin ? isAccountAdmin === 'true' : null,
      };

      const targetVendor = req.query.targetVendor as string | undefined;

      if (userRole === ValidUserRoles.SUPER_ADMIN && targetVendor) {
        req['user'].cover = targetVendor;
      }
    }

    next();
  }

  private _validateUserData(
    userId: string | string[] | undefined,
    accountId: string | string[] | undefined,
    userRole: string | string[] | undefined,
    isAccountAdmin: string | string[] | undefined,
    cover: string | string[] | undefined,
  ): boolean {
    if (
      !this._isDataValidString(userId) ||
      !this._isRoleValid(userRole) ||
      !this._isDataValidString(cover)
    ) {
      return false;
    }

    if (accountId && !this._isDataValidString(accountId)) {
      return false;
    }

    if (isAccountAdmin && !this._isDataValidString(isAccountAdmin)) {
      return false;
    }

    if (
      isAccountAdmin &&
      isAccountAdmin !== 'true' &&
      isAccountAdmin !== 'false'
    ) {
      return false;
    }

    if (userRole === ValidUserRoles.USER && !accountId && !isAccountAdmin) {
      return false;
    }

    return true;
  }

  private _isRoleValid(
    userRole: string | string[] | undefined,
  ): userRole is ValidUserRoles {
    if (!this._isDataValidString(userRole)) {
      return false;
    }

    return this._VALID_USER_ROLES.includes(userRole as ValidUserRoles);
  }

  private _isDataValidString(
    data: string | string[] | undefined,
  ): data is string {
    if (!data || Array.isArray(data) || data.length === 0) {
      return false;
    }

    return true;
  }
}
