
import { LoggerService } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as os from 'os';
import { AsyncContext } from '../async-context/async-context';

export enum LoggingEvent {
  SYSTEM = 'system',
}

export enum LoggingCategory {
  API_REQUEST_RESPONSE = 'api_request_response',
  ERROR = 'error',
  USER_ACTION = 'user_action',
  SYSTEM_ACTION = 'system_action',
}

export class Logger implements LoggerService {
  private loggerInstance: LoggerService;

  private logFormat: string;

  /**
   * Custom logger.
   * @param event Event type for the logger.
   * @param category Category of the logger.
   * @param className Class generating the logs.
   * @param context Async context to handle correlation ID.
   * @returns Custom Winston logger.
   */
  constructor(
    event: LoggingEvent,
    category: LoggingCategory,
    className: string,
    context?: AsyncContext<string, any>,
  ) {
    // Create Winston logger with custom format.
    /* eslint-disable no-param-reassign */
    this.logFormat = process.env.LOG_FORMAT || 'json';
    this.loggerInstance = WinstonModule.createLogger({
      exitOnError: false,
      transports: [
        new winston.transports.Console({
          level: process.env.LOG_LEVEL ?? 'debug',
          format: winston.format.combine(
            winston.format((info) => {
              if (context !== undefined) {
                info.correlationId = context.has('traceId')
                  ? context.get('traceId')
                  : 'noCorrelationId';
              } else {
                info.correlationId = 'noCorrelationId';
              }

              return info;
            })(),
            winston.format.align(),
            winston.format.errors(),
            winston.format.simple(),
            winston.format.splat(),
            winston.format.timestamp(),
            // Used for logging the host where the application runs
            winston.format.label({ label: os.hostname() }),
            winston.format.prettyPrint(),
            this.logFormat === 'json'
              ? winston.format.printf((log) => {
                const dataMessage = log.message.includes('correlationId')
                  ? `{"message":${log.message.trim()}}`
                  : `{"message":"${log.message.trim()}"}`;

                return log.correlationId !== 'noCorrelationId'
                  ? `{"timestamp":"${log.timestamp}","label":"${
                    log.label
                  }","level":"${log.level}",\
"event":"${event}","category":"${category}","generator":"${className}","correlationId":"${
  log.correlationId
}","data":"${log.message.trim()}"}`
                  : `{"timestamp":"${log.timestamp}","label":"${log.label}","level":"${log.level}",\
"event":"${event}","category":"${category}","generator":"${className}","data":${dataMessage}}`;
              })
              : winston.format.simple(),
          ),
        }),
      ],
    });
    /* eslint-enable no-param-reassign */
  }

  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    this.loggerInstance.log(message, ...optionalParams);
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {
    this.loggerInstance.error(message, ...optionalParams);
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    this.loggerInstance.warn(message, ...optionalParams);
  }

  /**
   * Write a 'debug' level log.
   */
  debug(message: any, ...optionalParams: any[]) {
    this.loggerInstance.debug?.(message, ...optionalParams);
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose(message: any, ...optionalParams: any[]) {
    this.loggerInstance.verbose?.(message, ...optionalParams);
  }
}
