
import { DataSource } from 'typeorm';
import { Resource } from 'src/resource/model/resource.entity';
import { Profile } from 'src/profile/model/profile.entity';
import { ResourceMock } from 'test/mocks/resource.mocks';
import { randomUUID } from 'crypto';

export class ResourcePopulate {
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async createResource(profileId: string): Promise<Resource> {
    const resourceDto = ResourceMock.getDto(profileId);
    const profile = await this.dataSource.manager.findOne<Profile>(
        Profile, 
        { where: { id: profileId }}
    );
    if (!profile) {
      throw new Error('Profile not found');
    }
    const resource = new Resource({
      name: resourceDto.name,
      address: resourceDto.address,
      id: randomUUID(),
      profile: profile,
    });

    return this.dataSource.manager.save(resource);
  }
}
