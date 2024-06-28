
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { EnvironmentVariable } from './model/environment-variable.enum';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get(EnvironmentVariable.POSTGRES_HOST),
    port: Number(configService.get(EnvironmentVariable.POSTGRES_PORT)),
    username: configService.get(EnvironmentVariable.POSTGRES_USER),
    password: configService.get(EnvironmentVariable.POSTGRES_PASSWORD),
    database: configService.get(EnvironmentVariable.POSTGRES_DATABASE),
    entities: [`${__dirname}/../**/*.entity.{js,ts}`],
    synchronize: false,
    ssl: {
      require: true,
      disable: false,
    }[configService.get<string>(EnvironmentVariable.POSTGRES_SSLMODE) ?? ''],
  }),
  inject: [ConfigService],
};

const configServiceDS = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configServiceDS.get(EnvironmentVariable.POSTGRES_HOST),
  port: Number(configServiceDS.get(EnvironmentVariable.POSTGRES_PORT)),
  username: configServiceDS.get(EnvironmentVariable.POSTGRES_USER),
  password: configServiceDS.get(EnvironmentVariable.POSTGRES_PASSWORD),
  database: configServiceDS.get(EnvironmentVariable.POSTGRES_DATABASE),
  entities: [`${__dirname}/../**/*.entity.{js,ts}`],
  migrations: [`${__dirname}/../database/migrations/*{.ts,.js}`],
  synchronize: false,
  logging: true,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
