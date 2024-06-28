import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ProfilePostDto } from './model/profile.dto';
import { Profile } from './model/profile.entity';
import { Logger, LoggingCategory, LoggingEvent } from '../utils/logger';
import { AsyncContext } from '../async-context/async-context';
import { ErrorMessage, StringFormatter } from '../utils/string-formatter';

@Injectable()
export class ProfileService {
  /**
   * Logger.
   */
  private readonly logger: Logger;

  /**
   * Constructor.
   * @param dataSource
   * @param asyncContext Handler of correlation ID.
   */
  constructor(
    private dataSource: DataSource,
    private readonly asyncContext: AsyncContext<string, any>,
  ) {
    this.logger = new Logger(
      LoggingEvent.SYSTEM,
      LoggingCategory.USER_ACTION,
      ProfileService.name,
      this.asyncContext,
    );
  }

  /**
   * Gets a profile applying filters.
   * @param filter The filters to apply to the query.
   * @returns An array of profiles that match the query requested.
   */
  async getProfiles(role?: string): Promise<Profile[]> {
    let whereCondition = {};
    if (role) {
      whereCondition = { role };
    }

    return this.dataSource.manager.find(
      Profile,
      {
        relations: { resources: true },
        where: whereCondition,
      },
    );
  }

  /**
   * Gets a profile by ID
   * @param id The id of the profile.
   * @returns Specific profile.
   */
  async getProfileById(id: string): Promise<Profile> {
    const profile = await this.dataSource.manager.findOne(
      Profile,
      {
        relations: { resources: true },
        where: { id },
      },
    );

    if (!profile) {
      throw new NotFoundException(
        StringFormatter.format(ErrorMessage.ENTITY_NOT_FOUND_FOR_ID, Profile.name, id),
      );
    }

    return profile;
  }

  /**
   * Creates a new profile.
   * @param id ID of the profile.
   * @param profile Profile of the user.
   * @returns Created profile.
   */
  async createProfile(profile: ProfilePostDto): Promise<Profile> {
    const newProfile = new Profile({ ...profile, id: uuidv4() });

    const createdProfile = await this.dataSource.manager.save(newProfile);

    this.logger.log(`Profile created with id: ${createdProfile.id}`);

    return createdProfile;
  }

  /**
   * Updates an existing Profile.
   * @param id The ID of the Profile to be updated.
   * @param profilePutDto Object that contains the data to be used to update the Profile.
   * @returns Profile updated.
   */
  async updateProfile(id: string, profilePutDto: ProfilePostDto): Promise<Profile> {
    const profileToUpdate = await this.getProfileById(id);
    if (!profileToUpdate) {
      throw new NotFoundException(
        StringFormatter.format(ErrorMessage.ENTITY_NOT_FOUND_FOR_ID, Profile.name, id),
      );
    }

    Object.assign(profileToUpdate, profilePutDto);
    const updatedProfile = await this.dataSource.manager.save(profileToUpdate);

    this.logger.log(`Profile updated with id: ${updatedProfile}`);

    return updatedProfile;
  }
}
