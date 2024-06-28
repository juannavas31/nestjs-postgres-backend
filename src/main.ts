import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { Logger, LoggingCategory, LoggingEvent } from './utils/logger';
import { EnvironmentVariable } from './config/model/environment-variable.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Create logger for startup; here, the context is constituating the generator class
    logger: new Logger(
      LoggingEvent.SYSTEM,
      LoggingCategory.SYSTEM_ACTION,
      'Bootstrap',
    ),
  });
  const configService = app.get(ConfigService);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  const options = new DocumentBuilder()
    .setTitle('Temporary Backend')
    .setDescription('A backend for Temporary applications')
    .setVersion(configService.get(EnvironmentVariable.API_VERSION) ?? '1')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'bearerAuth')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(configService.get(EnvironmentVariable.MIDDLEWARE_PORT) ?? 3002);
}
bootstrap();
