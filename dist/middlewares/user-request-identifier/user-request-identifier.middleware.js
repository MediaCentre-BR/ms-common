"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRequestIdentifierMiddleware = void 0;
const common_1 = require("@nestjs/common");
const request_user_types_1 = require("../../types/request-user.types");
let UserRequestIdentifierMiddleware = class UserRequestIdentifierMiddleware {
    _VALID_USER_ROLES = Object.values(request_user_types_1.ValidUserRoles);
    use(req, res, next) {
        const userId = req.headers['x-user-id'];
        const accountId = req.headers['x-account-id'];
        const isAccountAdmin = req.headers['x-is-account-admin'];
        const userRole = req.headers['x-user-role'];
        const cover = req.headers['x-cover'];
        if (this._validateUserData(userId, accountId, userRole, isAccountAdmin, cover)) {
            req['user'] = {
                userId: userId,
                userRole: userRole,
                cover: cover,
                userAccountId: accountId ? accountId : null,
                isAccountAdmin: isAccountAdmin ? isAccountAdmin === 'true' : null,
            };
            const targetVendor = req.query.targetVendor;
            if (userRole === request_user_types_1.ValidUserRoles.SUPER_ADMIN && targetVendor) {
                req['user'].cover = targetVendor;
            }
        }
        next();
    }
    _validateUserData(userId, accountId, userRole, isAccountAdmin, cover) {
        if (!this._isDataValidString(userId) ||
            !this._isRoleValid(userRole) ||
            !this._isDataValidString(cover)) {
            return false;
        }
        if (accountId && !this._isDataValidString(accountId)) {
            return false;
        }
        if (isAccountAdmin && !this._isDataValidString(isAccountAdmin)) {
            return false;
        }
        if (isAccountAdmin &&
            isAccountAdmin !== 'true' &&
            isAccountAdmin !== 'false') {
            return false;
        }
        if (userRole === request_user_types_1.ValidUserRoles.USER && !accountId && !isAccountAdmin) {
            return false;
        }
        return true;
    }
    _isRoleValid(userRole) {
        if (!this._isDataValidString(userRole)) {
            return false;
        }
        return this._VALID_USER_ROLES.includes(userRole);
    }
    _isDataValidString(data) {
        if (!data || Array.isArray(data) || data.length === 0) {
            return false;
        }
        return true;
    }
};
exports.UserRequestIdentifierMiddleware = UserRequestIdentifierMiddleware;
exports.UserRequestIdentifierMiddleware = UserRequestIdentifierMiddleware = __decorate([
    (0, common_1.Injectable)()
], UserRequestIdentifierMiddleware);
//# sourceMappingURL=user-request-identifier.middleware.js.map