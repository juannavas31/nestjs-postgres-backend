
import { randomUUID } from 'crypto';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AsyncContext } from './async-context';
import { Logger, LoggingEvent, LoggingCategory } from '../utils/logger';

@Injectable()
export class AsyncContextInterceptor implements NestInterceptor {
  private readonly logger: Logger;

  constructor(private readonly asyncContext: AsyncContext<string, any>) {
    this.asyncContext.register();
    this.logger = new Logger(
      LoggingEvent.SYSTEM,
      LoggingCategory.API_REQUEST_RESPONSE,
      'HTTP',
    );
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.asyncContext.register();
    // Correlation ID
    this.asyncContext.set('traceId', randomUUID()); // Setting default value traceId
    const request = context.switchToHttp().getRequest();
    let correlationId: string = request.headers['x-correlation-id'] as string;
    if (correlationId === undefined) {
      correlationId = randomUUID();
    }
    this.asyncContext.set('traceId', correlationId);
    const response = context.switchToHttp().getResponse();
    response.setHeader('x-correlation-id', correlationId);

    // Logs
    let message = `{"correlationId":"${response.getHeader(
      'x-correlation-id',
    )}","method":"${request.method}","endpoint":"${request.originalUrl}","status":`;

    response.on('finish', () => {
      if (response.statusCode >= 500) {
        return this.logger.error(message);
      }
      if (response.statusCode >= 400) {
        return this.logger.warn(message);
      }
      if ((request.originalUrl === '/health' || request.originalUrl === '/health/true')
      && response.statusCode === 200) {
        return null;
      }
      message += `${response.statusCode}}`;

      return this.logger.log(message);
    });

    // Error handler
    return next.handle().pipe(
      catchError((err) => {
        response.statusCode = err.status || 500;
        // Remove double quotes and line breaks in err.stack
        const stackFormatted = err.stack.replace(/['"]+/g, '').replace(/(\r\n|\n|\r)/gm, '');
        // Obtain nested errors
        const nestedErrors = err.response?.message ?? '';
        message += `"${response.statusCode}","details":"${nestedErrors}","stack":"${stackFormatted}"}`;

        return throwError(
          () => new HttpException(
            {
              message: err?.message || err?.detail || 'Something went wrong',
              timestamp: new Date().toISOString(),
              route: request.path,
              method: request.method,
            },
            err.status || 500,
          ),
        );
      }),
    );
  }
}
