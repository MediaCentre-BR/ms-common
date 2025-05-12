"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_request_identifier_middleware_1 = require("src/middlewares/user-request-identifier/user-request-identifier.middleware");
describe('[ UserRequestIdentifierMiddleware ]', () => {
    let mockRequest;
    let mockResponse;
    let middleware;
    const mockNextFunc = () => undefined;
    beforeEach(() => {
        mockRequest = {
            headers: {},
        };
        mockResponse = {};
        middleware = new user_request_identifier_middleware_1.UserRequestIdentifierMiddleware();
    });
    [
        {
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
            header: {},
            expectReqFilled: false,
            expectAccountIdToBe: undefined,
            expectAccountAdminToBe: undefined,
        },
        {
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
                middleware.use(mockRequest, mockResponse, mockNextFunc);
            });
            it(header.expectReqFilled
                ? 'request should have user filled with correct data'
                : 'request should not have user filled', () => {
                if (header.expectReqFilled) {
                    expect(mockRequest.user).toBeDefined();
                    expect(mockRequest.user?.userId).toEqual(header.header['x-user-id']);
                    expect(mockRequest.user?.userAccountId).toEqual(header.expectAccountIdToBe);
                    expect(mockRequest.user?.isAccountAdmin).toEqual(header.expectAccountAdminToBe);
                    expect(mockRequest.user?.userRole).toEqual(header.header['x-user-role']);
                    expect(mockRequest.user?.cover).toEqual(header.header['x-cover']);
                    return;
                }
                expect(mockRequest.user).not.toBeDefined();
            });
        });
    });
});
//# sourceMappingURL=user-request-identifier.middleware.spec.js.map