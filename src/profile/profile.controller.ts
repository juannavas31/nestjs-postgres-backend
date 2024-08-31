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
  Query,
  Put,
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
  ApiQuery,
} from '@nestjs/swagger';
import { ProfilePostDto } from './model/profile.dto';
import { Profile } from './model/profile.entity';
import { ProfileService } from './profile.service';
import { Logger, LoggingCategory, LoggingEvent } from '../utils/logger';
import { AsyncContext } from '../async-context/async-context';

@ApiTags('profiles')
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
@Controller('profiles')
export class ProfileController {
  /**
   * Logger.
   */
  private readonly logger: Logger;

  /**
   * Constructor.
   * @param profileService Service for handling profile calls.
   * @param asyncContext Handler of correlation ID.
   */
  constructor(
    private profileService: ProfileService,
    private readonly asyncContext: AsyncContext<string, any>,
  ) {
    this.logger = new Logger(
      LoggingEvent.SYSTEM,
      LoggingCategory.USER_ACTION,
      ProfileController.name,
      this.asyncContext,
    );
  }

  @Get()
  @ApiOperation({
    summary:
      'Gets all profiles.',
  })
  @ApiQuery({
    name: 'role',
    description: 'Enables filtering the profiles by role',
    required: false,
  })
  @ApiOkResponse({
    description: 'OK',
    type: [Profile],
  })
  async getAllProfiles(
    @Query('role') role?: string,
  ): Promise<Profile[]> {
    // the controller should perform authentication and authorization
    // this is out of the scope of this example

    return this.profileService.getProfiles(role);
  }

  @Get(':profileId')
  @ApiOperation({
    summary:
      'Gets a specific profile by profile ID.',
  })
  @ApiParam({
    name: 'profileId',
    description: 'ID of the profile.',
    required: true,
  })
  @ApiOkResponse({
    description: 'OK',
    type: Profile,
  })
  async getProfileById(
    @Param('profileId') profileId: string,
  ): Promise<Profile> {
    return this.profileService.getProfileById(profileId);
  }

  @Post()
  @ApiOperation({
    summary:
      'Creates a new profile.',
  })
  @ApiParam({
    name: 'profileId',
    description: 'ID to use for the profile creation.',
    required: false,
  })
  @ApiBody({
    type: ProfilePostDto,
    description: 'Profile data.',
    required: true,
  })
  @ApiCreatedResponse({
    description: 'Profile created',
    type: Profile,
  })
  async createProfile(
    @Body() profile: ProfilePostDto,
  ): Promise<Profile> {
    return this.profileService.createProfile(profile);
  }

  @Put(':profileId')
  @ApiOperation({
    summary:
      'Updates an existing Profile.',
  })
  @ApiParam({
    name: 'profileId',
    description: 'ID of the Profile to update.',
    required: true,
  })
  @ApiBody({
    type: ProfilePostDto,
    description: 'Profile data.',
    required: true,
  })
  @ApiOkResponse({
    description: 'Profile updated',
    type: Profile,
  })
  async updateProfile(
    @Body() profilePutDto: ProfilePostDto,
    @Param('profileId') profileId: string,
  ): Promise<Profile> {
    return this.profileService.updateProfile(profileId, profilePutDto);
  }
}
