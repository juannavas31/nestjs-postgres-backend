import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { TestDbService } from 'test/utils/testDbService';
import { Resource } from 'src/resource/model/resource.entity';
import { AsyncContextModule } from 'src/async-context/async-context.module';
import { AsyncContext } from 'src/async-context/async-context';
import { mockAsyncContext } from 'test/mocks/async-context/async-context';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalTypeOrm } from 'test/utils/global.typeOrm';
import { NotFoundException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { ResourceController } from 'src/resource/resource.controller';
import { ResourceService } from 'src/resource/resource.service';
import { ProfileMock } from 'test/mocks/profile.mocks';
import { ResourceMock } from './mocks/resource.mocks';

describe('ResourceController', () => {
  let resourceController: ResourceController;
  let testDbService: TestDbService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        GlobalTypeOrm(),
        TypeOrmModule.forFeature([Resource]),
        AsyncContextModule.forRoot(),
      ],
      controllers: [ResourceController],
      providers: [
        ResourceService,
        TestDbService,
        {
          provide: AsyncContext,
          useValue: mockAsyncContext,
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    resourceController = moduleRef.get(ResourceController);
    testDbService = moduleRef.get(TestDbService);
  });

  afterEach(async () => {
    await testDbService.destroyDb();
  });

  it('should create a new resource', async () => {
    // arrange
    const profile = await testDbService.createProfile();
    const resourceDto = ResourceMock.getDto(profile.id);

    // act
    const createResourceResult = await resourceController.createResource(resourceDto);

    // assert
    expect(createResourceResult).toHaveProperty('name', resourceDto.name);
    expect(createResourceResult).toHaveProperty('address', resourceDto.address);
    expect(createResourceResult).toHaveProperty('profile');
    expect(createResourceResult.profile).toHaveProperty('id', profile.id);
  });

    it('should get a resource by id', async () => {
        // arrange
        const resource = await testDbService.createResource();
    
        // act
        const getResourceResult = await resourceController.getResourceById(resource.id);
    
        // assert
        expect(getResourceResult).toHaveProperty('name', resource.name);
        expect(getResourceResult).toHaveProperty('address', resource.address);
        expect(getResourceResult).toHaveProperty('profile');
    });

    it('should throw NotFoundException when getting a resource with an invalid id', async () => {
        // arrange
        const invalidId = 'invalid-id';
    
        // act and assert
        await expect(resourceController.getResourceById(invalidId)).rejects.toThrow(NotFoundException);
    });
});