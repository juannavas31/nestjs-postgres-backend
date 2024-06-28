
import { TypeOrmModule } from '@nestjs/typeorm';

export const GlobalTypeOrm = () => TypeOrmModule.forRoot({
  type: 'better-sqlite3',
  database: ':memory:',
  dropSchema: true,
  entities: [`${__dirname}/../../src/**/*.entity.{js,ts}`],
  autoLoadEntities: true,
  synchronize: true,
});

