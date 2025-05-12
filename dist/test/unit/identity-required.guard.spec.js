"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const identity_required_guard_1 = require("src/guards/identity-required/identity-required.guard");
describe('[ IdentityRequiredGuard ]', () => {
    let request = {
        user: true,
    };
    const context = {
        switchToHttp: () => ({
            getRequest: () => request,
        }),
    };
    beforeEach(() => {
        request = {
            user: true,
        };
    });
    it('should throw an error if user not provided in the request', () => {
        const guard = new identity_required_guard_1.IdentityRequiredGuard();
        request = {};
        expect(() => guard.canActivate(context)).toThrow();
    });
    it('should return true if user is provided in the request', () => {
        const guard = new identity_required_guard_1.IdentityRequiredGuard();
        const result = guard.canActivate(context);
        expect(result).toBe(true);
    });
});
//# sourceMappingURL=identity-required.guard.spec.js.map