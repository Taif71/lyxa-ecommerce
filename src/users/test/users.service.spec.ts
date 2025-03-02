import { Test, TestingModule } from '@nestjs/testing';
import { UserProfileService, UsersService } from '../services';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import {
  SCHEMA,
  mockCreateUserDto,
  mockMongodbModel,
  mockUser,
  mockUserProfile,
} from '../../common/mock';
import {
  AwsS3Service,
  DOSpaceService,
  FilesService,
  LocalStorageService,
} from '../../files/services';
import { IUser, IUserProfile } from '../interfaces';
import * as helper from '../../common/utils/helper';
import { NotAcceptableException } from '@nestjs/common';

// test cases to test user.service.ts register function
describe('UsersService', () => {
  let usersService: UsersService;
  let userModel: Record<string, jest.Mock>;
  let profileModel: Record<string, jest.Mock>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UserProfileService,
        FilesService,
        DOSpaceService,
        AwsS3Service,
        LocalStorageService,
        {
          provide: getModelToken(SCHEMA.USER),
          useClass: mockMongodbModel,
        },
        {
          provide: getModelToken(SCHEMA.USER_PROFILE),
          useClass: mockMongodbModel,
        },
        {
          provide: 'lib:do-spaces-service',
          useValue: '',
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userModel = module.get<Record<string, jest.Mock<IUser>>>(
      getModelToken(SCHEMA.USER),
    );
    profileModel = module.get<Record<string, jest.Mock<IUserProfile>>>(
      getModelToken(SCHEMA.USER_PROFILE),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(userModel).toBeDefined();
    expect(profileModel).toBeDefined();
  });

  it('should register a user', async () => {
    userModel.findOne.mockResolvedValue(null);
    userModel.create.mockResolvedValue({
      ...mockUser,
      ...new mockMongodbModel(),
    });
    profileModel.create.mockResolvedValue({
      ...mockUserProfile,
      ...new mockMongodbModel(),
    });

    const spyToLowerCase = jest.spyOn(String.prototype, 'toLowerCase');
    const spyToDate = jest.spyOn(Date, 'now');
    const spyEncodeToken = jest.spyOn(helper, 'encodeToken');
    const spyOnUserCreate = jest.spyOn(userModel, 'create');
    const spyOnUserProfileCreate = jest.spyOn(profileModel, 'create');


    const result = await usersService.register(mockCreateUserDto);
    
    expect(result).toEqual(expect.objectContaining(mockUser));
    expect(spyToLowerCase).toBeCalledTimes(2);
    expect(spyToDate).toBeCalledTimes(5);
    expect(spyEncodeToken).toBeCalledTimes(1);
    expect(spyOnUserCreate).toBeCalledTimes(1);
    expect(spyOnUserProfileCreate).toBeCalledTimes(1);

  });

  it('should throw error on duplicate user registration', async () => {
    userModel.findOne.mockResolvedValue({
      ...mockUser,
      ...new mockMongodbModel(),
    });

    const spyToLowerCase = jest.spyOn(String.prototype, 'toLowerCase');
    try {
      await usersService.register(mockCreateUserDto);
    } catch (err) {
      expect(err).toBeInstanceOf(NotAcceptableException);
      expect(err.message).toBe(
        `User already exist with the ${mockCreateUserDto.email}`,
      );
    }

    expect(spyToLowerCase).toBeCalledTimes(1);
  });
});
