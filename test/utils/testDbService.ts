
import { Injectable } from '@nestjs/common';
import { DataSource, FindOneOptions } from 'typeorm';
import { ProfilePopulate } from 'test/utils/profile.populate';
import { ResourcePopulate } from 'test/utils/resource.populate';
import { Profile } from 'src/profile/model/profile.entity';
import { Resource } from 'src/resource/model/resource.entity';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';

// this provider is used to populate the database, using the injected datasource
@Injectable()
export class TestDbService {
  constructor(
    private dataSource: DataSource,
  ) { }

  async destroyDb(): Promise<void> {
    await this.dataSource.destroy();
  }

  async createProfile(profileId?: string): Promise<Profile> {
    return new ProfilePopulate(this.dataSource).createProfile(profileId);
  }

  async createResource(profileId?: string): Promise<Resource> {
    if (!profileId) {
      const profile = await this.createProfile();
      profileId = profile.id;
    } 

    return new ResourcePopulate(this.dataSource).createResource(profileId);
  }
}
