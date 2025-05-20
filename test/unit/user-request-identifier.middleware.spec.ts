import { Request } from 'express';
import { Response } from 'express-serve-static-core';
import { UserRequestIdentifierMiddleware } from 'src/middlewares/user-request-identifier/user-request-identifier.middleware';
import { RequestUser, ValidUserRoles } from 'src/types/request-user.types';

describe('[ UserRequestIdentifierMiddleware ]', () => {
  let mockRequest: Partial<Request & { user?: RequestUser }>;
  let mockResponse: Partial<Response>;
  let middleware: UserRequestIdentifierMiddleware;
  const mockNextFunc = () => undefined;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };

    mockResponse = {};

    middleware = new UserRequestIdentifierMiddleware();
  });

  [
    {
      // Testing valid user identity
      header: {
        'x-user-id': '123',
        'x-account-id': '456',
        'x-is-account-admin': 'true',
        'x-user-role': 'user',
        'x-cover': 'metos',
      },
      expectReqFilled: true,
      expectAccountIdToBe: '456',
      expectAccountAdminToBe: true,
    },
    {
      // Testing valid empty user identity
      header: {},
      expectReqFilled: false,
      expectAccountIdToBe: undefined,
      expectAccountAdminToBe: undefined,
    },
    {
      // Testing invalid user identity with wrong typed fields
      header: {
        'x-user-id': '123',
        'x-account-id': ['Error'],
        'x-is-account-admin': 'false',
        'x-user-role': 'user',
        'x-cover': 'metos',
      },
      expectReqFilled: false,
      expectAccountIdToBe: undefined,
      expectAccountAdminToBe: undefined,
    },
    {
      // Testing invalid user identity with wrong typed fields
      header: {
        'x-user-id': '123',
        'x-account-id': '456',
        'x-is-account-admin': ['Error'],
        'x-user-role': 'user',
        'x-cover': 'metos',
      },
      expectReqFilled: false,
      expectAccountIdToBe: undefined,
      expectAccountAdminToBe: undefined,
    },
    {
      // Testing invalid user identity with wrong typed fields
      header: {
        'x-user-id': '123',
        'x-account-id': '456',
        'x-is-account-admin': 'invalid-data',
        'x-user-role': 'user',
        'x-cover': 'metos',
      },
      expectReqFilled: false,
      expectAccountIdToBe: undefined,
      expectAccountAdminToBe: undefined,
    },
    {
      // Testing invalid user identity with wrong typed fields
      header: {
        'x-user-id': '123',
        'x-account-id': '456',
        'x-is-account-admin': 'false',
        'x-user-role': ['error'],
        'x-cover': 'metos',
      },
      expectReqFilled: false,
      expectAccountIdToBe: undefined,
      expectAccountAdminToBe: undefined,
    },
    {
      // Testing invalid user identity with invalid role
      header: {
        'x-user-id': '123',
        'x-account-id': '456',
        'x-is-account-admin': 'Error',
        'x-user-role': 'invalid-role',
        'x-cover': 'metos',
      },
      expectReqFilled: false,
      expectAccountIdToBe: undefined,
      expectAccountAdminToBe: undefined,
    },
    {
      // Testing valid admin identity
      header: {
        'x-user-id': '123',
        'x-user-role': 'admin',
        'x-cover': 'metos',
      },
      expectReqFilled: true,
      expectAccountIdToBe: null,
      expectAccountAdminToBe: null,
    },
    {
      // Testing invalid user identity
      header: {
        'x-user-id': '123',
        'x-user-role': 'user',
        'x-cover': 'metos',
      },
      expectReqFilled: false,
      expectAccountIdToBe: undefined,
      expectAccountAdminToBe: undefined,
    },
  ].forEach((header) => {
    describe('when header is ' + JSON.stringify(header.header), () => {
      beforeEach(() => {
        mockRequest.headers = header.header;
        middleware.use(
          mockRequest as Request,
          mockResponse as Response,
          mockNextFunc as () => void,
        );
      });

      it(
        header.expectReqFilled
          ? 'request should have user filled with correct data'
          : 'request should not have user filled',
        () => {
          if (header.expectReqFilled) {
            expect(mockRequest.user).toBeDefined();

            expect(mockRequest.user?.userId).toEqual(
              header.header['x-user-id'],
            );
            expect(mockRequest.user?.userAccountId).toEqual(
              header.expectAccountIdToBe,
            );
            expect(mockRequest.user?.isAccountAdmin).toEqual(
              header.expectAccountAdminToBe,
            );
            expect(mockRequest.user?.userRole).toEqual(
              header.header['x-user-role'] as ValidUserRoles,
            );
            expect(mockRequest.user?.cover).toEqual(header.header['x-cover']);
            return;
          }

          expect(mockRequest.user).not.toBeDefined();
        },
      );
    });
  });
});
