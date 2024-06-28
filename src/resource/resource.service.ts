import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ResourcePostDto } from './model/resource.dto';
import { Resource } from './model/resource.entity';
import { Profile } from '../profile/model/profile.entity';
import { Logger, LoggingCategory, LoggingEvent } from '../utils/logger';
import { AsyncContext } from '../async-context/async-context';
import { ErrorMessage, StringFormatter } from '../utils/string-formatter';

@Injectable()
export class ResourceService {
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
      ResourceService.name,
      this.asyncContext,
    );
  }

  /**
   * Gets all resources.
   * @returns An array of resources.
   */
  async getResources(): Promise<Resource[]> {
    return this.dataSource.manager.find(
      Resource,
      {
        relations: { profile: true },
        where: {},
      },
    );
  }

  /**
   * Gets a resource by ID
   * @param id The id of the resource.
   * @returns Specific resource.
   */
  async getResourceById(id: string): Promise<Resource> {
    const resource = await this.dataSource.manager.findOne(
      Resource,
      {
        relations: { profile: true },
        where: { id },
      },
    );

    if (!resource) {
      throw new NotFoundException(
        StringFormatter.format(ErrorMessage.ENTITY_NOT_FOUND_FOR_ID, Resource.name, id),
      );
    }

    return resource;
  }

  /**
   * Creates a new resource.
   * @param resource Resource of the user.
   * @returns Created resource.
   */
  async createResource(resource: ResourcePostDto): Promise<Resource> {
    const profile = await this.dataSource.manager.findOne(
      Profile,
      {
        where: { id: resource.profileId },
      },
    );

    if (!profile) {
      throw new NotAcceptableException(
        StringFormatter.format(ErrorMessage.ENTITY_NOT_FOUND_FOR_ID, Profile.name, resource.profileId),
      );
    }

    const newResource = new Resource({ ...resource, id: uuidv4(), profile });

    const createdResource = await this.dataSource.manager.save(newResource);

    this.logger.log(`Resource created with id: ${createdResource.id}`);

    return createdResource;
  }
}
