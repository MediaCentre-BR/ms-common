"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRequired = void 0;
const common_1 = require("@nestjs/common");
const request_user_types_1 = require("../../types/request-user.types");
let VendorRequired = class VendorRequired {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request?.['user'];
        if (!user) {
            throw new Error('No user data found in request');
        }
        if (user.userRole === request_user_types_1.ValidUserRoles.SUPER_ADMIN && user.cover === 'sudo') {
            throw new common_1.NotAcceptableException({
                message: 'A non sudo target vendor query parameter is required for super admin with sudo cover',
                codeName: 'SUPERADMIN_NO_TARGET_VENDOR',
            });
        }
        return true;
    }
};
exports.VendorRequired = VendorRequired;
exports.VendorRequired = VendorRequired = __decorate([
    (0, common_1.Injectable)()
], VendorRequired);
//# sourceMappingURL=vendor-required.js.map