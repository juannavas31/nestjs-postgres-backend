import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { ResourcePostDto } from './model/resource.dto';
import { Resource } from './model/resource.entity';
import { ResourceService } from './resource.service';
import { Logger, LoggingCategory, LoggingEvent } from '../utils/logger';
import { AsyncContext } from '../async-context/async-context';

@ApiTags('resources')
@ApiBearerAuth('bearerAuth')
@ApiBadRequestResponse({
  description: 'Bad request',
  type: BadRequestException,
})
@ApiUnauthorizedResponse({
  description: 'Unauthorized',
  type: UnauthorizedException,
})
@ApiForbiddenResponse({
  description: 'Forbidden',
  type: ForbiddenException,
})
@ApiNotFoundResponse({
  description: 'Not found',
  type: NotFoundException,
})
@ApiInternalServerErrorResponse({
  description: 'Internal server error',
  type: InternalServerErrorException,
})
@Controller('resources')
export class ResourceController {
  /**
   * Logger.
   */
  private readonly logger: Logger;

  /**
   * Constructor.
   * @param resourceService Service for handling resource calls.
   * @param asyncContext Handler of correlation ID.
   */
  constructor(
    private resourceService: ResourceService,
    private readonly asyncContext: AsyncContext<string, any>,
  ) {
    this.logger = new Logger(
      LoggingEvent.SYSTEM,
      LoggingCategory.USER_ACTION,
      ResourceController.name,
      this.asyncContext,
    );
  }

  @Get()
  @ApiOperation({
    summary:
      'Gets all resources',
  })
  @ApiOkResponse({
    description: 'OK',
    type: [Resource],
  })
  async getAllResources(): Promise<Resource[]> {
    return this.resourceService.getResources();
  }

  @Get(':resourceId')
  @ApiOperation({
    summary:
      'Gets a specific resource by ID.',
  })
  @ApiParam({
    name: 'resourceId',
    description: 'ID of the resource.',
    required: true,
  })
  @ApiOkResponse({
    description: 'OK',
    type: Resource,
  })
  async getResourceById(
    @Param('resourceId') resourceId: string,
  ): Promise<Resource> {
    return this.resourceService.getResourceById(resourceId);
  }

  @Post()
  @ApiOperation({
    summary:
      'Creates a new resource.',
  })
  @ApiBody({
    type: ResourcePostDto,
    description: 'Resource data.',
    required: true,
  })
  @ApiCreatedResponse({
    description: 'Resource created',
    type: Resource,
  })
  async createResource(
    @Body() resource: ResourcePostDto,
  ): Promise<Resource> {
    return this.resourceService.createResource(resource);
  }
}
