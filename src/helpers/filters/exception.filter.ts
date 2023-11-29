import { ArgumentsHost, Catch, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(
    private readonly adapterHost: HttpAdapterHost,
    private logger: Logger,
  ) {
    super(adapterHost.httpAdapter);
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    console.log('exception ', exception?.response);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      exception instanceof Error ? exception.message : exception.message?.error;

    if (exception.status === HttpStatus.NOT_FOUND) {
      status = HttpStatus.NOT_FOUND;
      message = 'Resource not found';
    }

    if (exception.status === HttpStatus.SERVICE_UNAVAILABLE) {
      status = HttpStatus.SERVICE_UNAVAILABLE;
      message = 'Service temporarily unavailable.';
    }

    if (exception.status === HttpStatus.NOT_ACCEPTABLE) {
      status = HttpStatus.NOT_ACCEPTABLE;
    }

    if (exception.status === HttpStatus.EXPECTATION_FAILED) {
      status = HttpStatus.EXPECTATION_FAILED;
    }

    if (exception.status === HttpStatus.BAD_REQUEST) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message || 'Operation failed!';
    }

    if (exception.status === HttpStatus.UNPROCESSABLE_ENTITY) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      message = exception.message || 'Operation failed!';
    }

    if (exception.status === HttpStatus.INTERNAL_SERVER_ERROR) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Error encountered while trying to process this request!';
    }

    if (exception.status === HttpStatus.UNAUTHORIZED) {
      status = HttpStatus.UNAUTHORIZED;
      message = exception.message || 'Request not authorized!';
    }

    if ((exception.statusCode ?? exception.status) === HttpStatus.CONFLICT) {
      status = HttpStatus.CONFLICT;
      message = exception.message || 'Duplicate found!';
    }

    response.status(status).json({
      statusCode: 500,
      message: message || 'An error occurred while process this request!',
      data: null,
    });
  }
}
