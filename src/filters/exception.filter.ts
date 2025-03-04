import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class ValidationExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse() as any;

        let message = 'Validation failed';
        let errorCode = 20001;
        if (exceptionResponse.errorCode) {
            errorCode = exceptionResponse.errorCode;
          }

        if (Array.isArray(exceptionResponse.message) && exceptionResponse.message.length > 0) {
            message = exceptionResponse.message[0]; // Get the first validation error message
        } else if (typeof exceptionResponse.message === 'string') {
            message = exceptionResponse.message;
        }

        response.status(status).json({
            status: status,
            errorCode: errorCode,
            message: message,
        });
    }
}
