import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // Log the error for internal tracking (exclude common 400/401/404s if desired)
    if (status >= 500) {
      this.logger.error(
        `HTTP Status: ${status} Error Message: ${typeof message === 'string' ? message : 'Internal server error'}`,
        exception instanceof Error ? exception.stack : '',
      );
    }

    // Guard: If headers have already been sent (e.g. JSON serialization
    // crash mid-stream), we cannot send another response. Just log and bail.
    if (response.headersSent) {
      this.logger.warn(
        `Headers already sent for ${request.url} — cannot send error response`,
      );
      return;
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception instanceof Error ? exception.message : message,
    });
  }
}
