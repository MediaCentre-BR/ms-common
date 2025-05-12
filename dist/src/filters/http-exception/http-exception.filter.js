"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HttpExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    _logger = new common_1.Logger(HttpExceptionFilter_1.name);
    catch(exception, host) {
        const context = host.switchToHttp();
        const response = context.getResponse();
        const request = context.getRequest();
        if (exception instanceof common_1.HttpException) {
            const exceptionResponse = this._getResponseFromHttpException(exception, request);
            response.status(exceptionResponse.statusCode);
            response.json(exceptionResponse);
            return;
        }
        const exceptionResponse = this._getResponseFromError(exception, request);
        response.status(exceptionResponse.statusCode);
        response.json(exceptionResponse);
        this._logUnhandledException(exception);
    }
    _getCodeNameFromException(exception) {
        if (!(exception instanceof common_1.HttpException)) {
            return common_1.HttpStatus[common_1.HttpStatus.INTERNAL_SERVER_ERROR];
        }
        const codeName = common_1.HttpStatus[exception.getStatus()];
        return codeName;
    }
    _extractMethodFromStackTrace(stackTrace) {
        const regex = /at (\w+\.\w+)/;
        const match = stackTrace.match(regex);
        return match ? match[1] : undefined;
    }
    _formatStackTrace(stackTrace) {
        return stackTrace
            .split('\n')
            .slice(1)
            .map((line) => line.trim())
            .join('\n');
    }
    _getResponseFromError(exception, request) {
        const statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const codeName = this._getCodeNameFromException(exception);
        const message = exception.message
            ? `${exception.name}: ${exception.message}`
            : 'No message provided';
        let details = 'No details provided';
        let stack = undefined;
        if (exception.stack) {
            if (process.env.NODE_ENV !== 'production') {
                stack = this._formatStackTrace(exception.stack);
            }
            details = this._extractMethodFromStackTrace(exception.stack) ?? details;
        }
        const action = `${request.method} ${request.originalUrl}`;
        return {
            action: action,
            status: 'error',
            statusCode,
            message,
            codeName,
            details,
            stack,
        };
    }
    _getResponseFromHttpException(exception, request) {
        const context = exception.getResponse();
        const message = typeof context['message'] === 'string' ||
            Array.isArray(context['message'])
            ? context['message']
            : typeof context['error'] === 'string'
                ? context['error']
                : 'No message provided';
        const codeName = typeof context['codeName'] === 'string'
            ? context['codeName']
            : this._getCodeNameFromException(exception);
        let details = typeof context['details'] === 'string'
            ? context['details']
            : 'No details provided';
        let stack = undefined;
        if (exception.stack) {
            if (process.env.NODE_ENV !== 'production') {
                stack = this._formatStackTrace(exception.stack);
            }
            details = this._extractMethodFromStackTrace(exception.stack) ?? details;
        }
        const statusCode = exception.getStatus();
        const action = `${request.method} ${request.originalUrl}`;
        return {
            action: action,
            status: 'error',
            statusCode,
            message,
            codeName,
            details,
            stack,
        };
    }
    _logUnhandledException(exception) {
        this._logger.error(`UNHANDLED Exception: ${exception.name}: ${exception.message} `, exception.stack + '\n');
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map