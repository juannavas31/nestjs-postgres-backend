
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { TestDbService } from 'test/utils/testDbService';
import { Profile } from 'src/profile/model/profile.entity';
import { AsyncContextModule } from 'src/async-context/async-context.module';
import { AsyncContext } from 'src/async-context/async-context';
import { mockAsyncContext } from 'test/mocks/async-context/async-context';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalTypeOrm } from 'test/utils/global.typeOrm';
import { NotFoundException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { ProfileController } from 'src/profile/profile.controller';
import { ProfileService } from 'src/profile/profile.service';
import { ProfileMock } from 'test/mocks/profile.mocks';

describe('ProfileController', () => {
  let profileController: ProfileController;
  let testDbService: TestDbService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        GlobalTypeOrm(),
        TypeOrmModule.forFeature([Profile]),
        AsyncContextModule.forRoot(),
      ],
      controllers: [ProfileController],
      providers: [
        ProfileService,
        TestDbService,
        {
          provide: AsyncContext,
          useValue: mockAsyncContext,
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    profileController = moduleRef.get(ProfileController);
    testDbService = moduleRef.get(TestDbService);
  });

  afterEach(async () => {
    await testDbService.destroyDb();
  });

  it('should create a new profile', async () => {
    // arrange
    const profileDto = ProfileMock.getDto();

    // act
    const createProfileResult = await profileController.createProfile(profileDto);

    // assert
    expect(createProfileResult).toHaveProperty('name', profileDto.name);
    expect(createProfileResult).toHaveProperty('emailAddress', profileDto.emailAddress);
    expect(createProfileResult).toHaveProperty('companyName', profileDto.companyName);
    expect(createProfileResult).toHaveProperty('role', profileDto.role);
  });

  it('should throw QueryFailedError when creating a profile with an email already registered', async () => {
    // arrange
    const profileDto = ProfileMock.getDto();
    await profileController.createProfile(profileDto);

    // act and assert

    await expect(profileController.createProfile(profileDto)).rejects.toThrow(QueryFailedError);
  });

  it('should get a specific profile', async () => {
    // arrange
    const profileDto = ProfileMock.getDto();
    const createProfileResult = await profileController.createProfile(profileDto);

    // act
    const profile = await profileController.getProfileById(createProfileResult.id);

    // assert
    expect(profile).toHaveProperty('id', createProfileResult.id);
  });

  it('should throw NotFoundException when getting a profile that does not exist', async () => {
    // arrange
    const profileId = '1234';

    // act and assert
    await expect(profileController.getProfileById(profileId)).rejects.toThrow(NotFoundException);
  });
});
