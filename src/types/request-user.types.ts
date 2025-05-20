import { Request } from 'express';

export interface RequestUser {
  userId: string;
  userAccountId: null | string;
  isAccountAdmin: null | boolean;
  userRole: ValidUserRoles;
  cover: string;
}

export enum ValidUserRoles {
  ADMIN = 'admin',
  USER = 'user',
  SUPER_ADMIN = 'super-admin',
}

export type RequestWithUser = Request & {
  user: RequestUser;
  handler?: string;
};
