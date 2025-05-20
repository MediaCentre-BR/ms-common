import { HttpStatus } from '@nestjs/common';

export interface ExceptionResponse {
  status: 'error';
  statusCode: HttpStatus;
  action: string;
  codeName: string;
  message: string | string[];
  details: string;
  stack?: string;
}
