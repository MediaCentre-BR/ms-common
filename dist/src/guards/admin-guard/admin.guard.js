"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminGuard = AdminGuard;
const common_1 = require("@nestjs/common");
const request_user_types_1 = require("../../utils/request-user.types");
function AdminGuard(allowedRoles = [
    request_user_types_1.ValidUserRoles.ADMIN,
    request_user_types_1.ValidUserRoles.SUPER_ADMIN,
]) {
    let UserRoleGuard = class UserRoleGuard {
        canActivate(context) {
            const request = context.switchToHttp().getRequest();
            const user = request?.['user'];
            if (!user) {
                throw new Error('No user data found in request');
            }
            if (!allowedRoles.some((role) => user.userRole === role)) {
                throw new common_1.UnauthorizedException({
                    message: 'You are not authorized to access this resource',
                    codeName: 'USER_ROLE_NOT_AUTHORIZED',
                });
            }
            return true;
        }
    };
    UserRoleGuard = __decorate([
        (0, common_1.Injectable)()
    ], UserRoleGuard);
    return new UserRoleGuard();
}
//# sourceMappingURL=admin.guard.js.map