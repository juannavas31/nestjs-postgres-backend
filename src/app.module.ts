import { Logger, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AsyncContextModule } from './async-context/async-context.module';
import { AsyncContextInterceptor } from './async-context/async-context.interceptor';
import { ProfileModule } from './profile/profile.module';
import { typeOrmAsyncConfig } from './config/typeorm.config';
import { ResourceModule } from './resource/resource.module';

@Module({
  imports: [
    // Use environment variables globally
    // https://docs.nestjs.com/techniques/configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    AsyncContextModule.forRoot(),
    ProfileModule,
    ResourceModule,
  ],
  controllers: [],
  providers: [
    Logger,
    {
      provide: APP_INTERCEPTOR,
      useClass: AsyncContextInterceptor,
    },
  ],
})
export class AppModule {}
