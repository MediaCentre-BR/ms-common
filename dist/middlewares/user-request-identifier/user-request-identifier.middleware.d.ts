import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
export declare class UserRequestIdentifierMiddleware implements NestMiddleware {
    private readonly _VALID_USER_ROLES;
    use(req: Request, res: Response, next: () => void): void;
    private _validateUserData;
    private _isRoleValid;
    private _isDataValidString;
}
