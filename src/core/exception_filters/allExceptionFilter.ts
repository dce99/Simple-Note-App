import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomGenericExecption } from './custom_exceptions/customGenException';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor() { }

    catch(exception: any, host: ArgumentsHost): void {

        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();
        let httpStatus =
            (exception instanceof HttpException || exception instanceof CustomGenericExecption)
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;
        if (!httpStatus) httpStatus = 400;
        const body = exception.response;
        const responseJson = {
            success: false,
            status_code: httpStatus,
            message: exception.message,
            detail: (body) ? body.detail : "",
            timestamp: new Date().toISOString(),
            error_type: (body && body.error_type) ? body.error_type : exception.name,
            errors: (body && body.errors) ? body.errors : [],
            path: request.url,
            method: request.method,
        };

        response
            .status(httpStatus)
            .json(responseJson);
    }
}

