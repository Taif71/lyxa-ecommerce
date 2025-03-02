import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log('exception: ', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      status !== HttpStatus.INTERNAL_SERVER_ERROR
        ? exception.message || exception['error'] || null
        : 'Internal server error';

    if (Object.prototype.hasOwnProperty.call(exception, 'status')) {
      status = exception['status']
        ? exception['status']
        : HttpStatus.INTERNAL_SERVER_ERROR;
      message =
        status !== HttpStatus.INTERNAL_SERVER_ERROR
          ? exception.message || exception['error'] || null
          : 'Internal server error';
    }

    if (
      exception &&
      exception['response'] &&
      exception['response'].hasOwnProperty('name') &&
      exception['response'].name === 'MongoError'
    ) {
      status = HttpStatus.NOT_ACCEPTABLE;
      message = 'Record already exist';
    }

    if (
      (exception &&
        exception['response'] &&
        exception['response'].hasOwnProperty('kind') &&
        exception['response'].kind === 'ObjectId') ||
      (exception.hasOwnProperty('kind') && exception['kind'] === 'ObjectId')
    ) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Invalid mongo id';
    }

    const errorResponse = {
      code: status,
      timestamp: new Date().toLocaleDateString(),
      path: request.url,
      method: request.method,
      message: message,
    };

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      Logger.error(
        `${request.method} ${request.url}`,
        exception.stack,
        'ExceptionFilter',
      );
    } else {
      Logger.error(
        `${request.method} ${request.url}`,
        JSON.stringify(errorResponse),
        'ExceptionFilter',
      );
    }

    const error = {
      status: 'ERROR',
      data: '',
      message: errorResponse.message || '',
    };
    response.status(status).json(error);
  }
}
