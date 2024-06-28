
import { DataSource } from 'typeorm';
import { Profile } from 'src/profile/model/profile.entity';
import { ProfileMock } from 'test/mocks/profile.mocks';
import { randomUUID } from 'crypto';

export class ProfilePopulate {
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async createProfile(profileId?: string): Promise<Profile> {
    const profileDto = ProfileMock.getDto();
    const id = profileId || randomUUID();
    const profile = new Profile({
      ...profileDto,
      id,
    });

    return this.dataSource.manager.save(profile);
  }
}
