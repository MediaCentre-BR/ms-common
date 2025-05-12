import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ExceptionResponse } from '../../utils/exception-response.types';

/**
 * A filter that handles exceptions thrown in the application and transforms them into appropriate HTTP responses.
 * It outputs the following object:
 *  ```typescript
 *  interface ExceptionResponse {
 *   status: "error",
 *   statusCode: HttpStatus, // The HTTP status code of the response
 *   message: string, // e.g. "Bad Request", "User not found", etc.
 *   codeName: string, // e.g. "BAD_REQUEST", "USER_NOT_FOUND", etc. Used for frontend error handling
 *   details: string, // Contains the class name and method name where the exception occurred
 *   stack?: string, // Development only: the stack trace of the exception
 *  }
 * ```
 *
 * @remarks
 * This filter catches both HttpException and other types of errors, logging them appropriately.
 * It also formats the response to include relevant information such as status code, message, and stack trace.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly _logger = new Logger(HttpExceptionFilter.name);

  /**
   * Catches exceptions thrown in the application and transforms them into appropriate HTTP responses.
   *
   * @param exception - The caught exception, which can be any Error object
   * @param host - The ArgumentsHost object which provides methods to access the request and response objects
   *
   * @remarks
   * This method handles two types of exceptions:
   * 1. HttpException - These are handled with their specific status codes and responses
   * 2. Other errors - These are converted to internal server error responses (500)
   *
   * Each type of exception is logged appropriately before sending the response to the client.
   */
  catch(exception: Error & { action?: string }, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    if (exception instanceof HttpException) {
      const exceptionResponse = this._getResponseFromHttpException(
        exception,
        request,
      );

      response.status(exceptionResponse.statusCode);
      response.json(exceptionResponse);
      return;
    }

    const exceptionResponse = this._getResponseFromError(exception, request);
    response.status(exceptionResponse.statusCode);
    response.json(exceptionResponse);

    this._logUnhandledException(exception);
  }

  /**
   * Extracts the HTTP status code name from an exception.
   *
   * @param exception - The exception to extract the code name from. Can be either a HttpException or a general Error.
   * @returns The HTTP status code name as a string. Returns 'INTERNAL_SERVER_ERROR' if the exception is not an instance of HttpException.
   *
   * @private
   */
  private _getCodeNameFromException(exception: HttpException | Error): string {
    if (!(exception instanceof HttpException)) {
      return HttpStatus[HttpStatus.INTERNAL_SERVER_ERROR];
    }

    const codeName = HttpStatus[exception.getStatus()];
    return codeName;
  }

  /**
   * Extracts the method name from a stack trace.
   *
   * @param stackTrace - The stack trace string to parse
   * @returns The extracted method name in format "Class.method" or undefined if not found
   */
  private _extractMethodFromStackTrace(stackTrace: string): string | undefined {
    const regex = /at (\w+\.\w+)/;
    const match = stackTrace.match(regex);

    return match ? match[1] : undefined;
  }

  /**
   * Formats the stack trace string by removing the first line and trimming each line.
   *
   * @param stackTrace - The stack trace string to format
   * @returns The formatted stack trace string
   */
  private _formatStackTrace(stackTrace: string): string {
    return stackTrace
      .split('\n')
      .slice(1)
      .map((line) => line.trim())
      .join('\n');
  }

  /**
   * Generates a standardized exception response object based on the provided error.
   *
   * @param exception - The error to be processed
   * @private
   */
  private _getResponseFromError(
    exception: Error & { action?: string },
    request: Request,
  ): ExceptionResponse {
    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    const codeName = this._getCodeNameFromException(exception);

    const message = exception.message
      ? `${exception.name}: ${exception.message}`
      : 'No message provided';

    let details: string = 'No details provided';

    let stack: string | undefined = undefined;

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

  /**
   * Generates a standardized exception response object based on the provided HttpException.
   *
   * @param exception - The HttpException to be processed
   * @private
   */
  private _getResponseFromHttpException(
    exception: HttpException & { action?: string },
    request: Request,
  ): ExceptionResponse {
    const context = exception.getResponse();
    const message =
      typeof context['message'] === 'string' ||
      Array.isArray(context['message'])
        ? context['message']
        : typeof context['error'] === 'string'
          ? context['error']
          : 'No message provided';

    const codeName =
      typeof context['codeName'] === 'string'
        ? context['codeName']
        : this._getCodeNameFromException(exception);

    let details =
      typeof context['details'] === 'string'
        ? context['details']
        : 'No details provided';

    let stack: string | undefined = undefined;

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

  /**
   * Logs the details of an unhandled exception.
   *
   * @param exception - The unhandled exception to log
   * @private
   */
  private _logUnhandledException(exception: Error): void {
    this._logger.error(
      `UNHANDLED Exception: ${exception.name}: ${exception.message} `,
      exception.stack + '\n',
    );
  }
}
