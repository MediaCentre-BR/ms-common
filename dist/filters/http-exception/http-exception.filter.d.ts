import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
export declare class HttpExceptionFilter implements ExceptionFilter {
    private readonly _logger;
    catch(exception: Error & {
        action?: string;
    }, host: ArgumentsHost): void;
    private _getCodeNameFromException;
    private _extractMethodFromStackTrace;
    private _formatStackTrace;
    private _getResponseFromError;
    private _getResponseFromHttpException;
    private _logUnhandledException;
}
