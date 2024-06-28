import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';
import { Resource } from './model/resource.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resource]),
  ],
  providers: [ResourceService],
  controllers: [ResourceController],
})
export class ResourceModule {}
