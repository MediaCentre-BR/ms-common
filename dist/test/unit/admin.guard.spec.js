"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin_guard_1 = require("src/guards/admin-guard/admin.guard");
describe('AdminGuard', () => {
    let mockRequest = {};
    const mockContext = {
        switchToHttp: () => ({
            getRequest: () => mockRequest,
        }),
    };
    [
        {
            request: {
                user: {
                    userRole: 'admin',
                },
            },
            expectToThrow: false,
        },
        {
            request: {
                user: {
                    userRole: 'user',
                },
            },
            expectToThrow: true,
        },
        {
            request: {
                user: {
                    userRole: 'super-admin',
                },
            },
            expectToThrow: false,
        },
        {
            request: {},
            expectToThrow: true,
        },
        {
            request: {
                user: {
                    userRole: 'invalid-role',
                },
            },
            expectToThrow: true,
        },
    ].forEach((request) => {
        describe('when request is ' + JSON.stringify(request.request), () => {
            beforeEach(() => {
                mockRequest = request.request;
            });
            it('should ' + (request.expectToThrow ? 'throw' : 'not throw'), () => {
                const guard = (0, admin_guard_1.AdminGuard)();
                if (request.expectToThrow) {
                    expect(() => guard.canActivate(mockContext)).toThrow();
                    return;
                }
                expect(guard.canActivate(mockContext)).toBe(true);
            });
        });
    });
});
//# sourceMappingURL=admin.guard.spec.js.map