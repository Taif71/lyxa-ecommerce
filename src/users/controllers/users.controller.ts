import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  UseGuards,
  UsePipes,
  HttpStatus,
  HttpCode,
  HttpException,
  Headers,
  MethodNotAllowedException,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { UsersService } from '../services';
import {
  CreateUserDto,
  EmailDto,
  PasswordDto,
  ResetPasswordDto,
  UpdateUserDto,
  OtpVerificationDto,
} from '../dto';
import { IUser } from '../interfaces';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ValidationPipe, TrimPipe, NullValidationPipe } from '../../common/pipes';
import { User } from '../../common/decorators/user.decorator';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiTags,
  ApiHeader,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';

/**
 * User Controller
 */
@ApiTags('User')
@ApiResponse({
  status: HttpStatus.METHOD_NOT_ALLOWED,
  description: 'Method not allowed',
})
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Server Error!',
})
@Controller('users')
export class UsersController {
  /**
   * Constructor
   * @param {UsersService} service
   */
  constructor(private readonly service: UsersService) {}

  /**
   * Create a user
   * @Body {CreateUserDto} data
   * @returns {Promise<IUser>} created user data
   */
  @ApiOperation({ summary: 'User registration: create new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return new user.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_ACCEPTABLE,
    description: 'Record already exist',
  })
  @UsePipes(new NullValidationPipe())
  @UsePipes(new ValidationPipe(true))
  @UsePipes(new TrimPipe())
  @Post()
  public async create(@Body() data: CreateUserDto): Promise<IUser> {
    try {
      return await this.service.register(data);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }

  @ApiExcludeEndpoint()
  @Put()
  public createPut() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Patch()
  public createPatch() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Delete()
  public createDelete() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  /**
   * verify a user by token
   * @Headers {Headers} headers
   * @returns {Promise<IUser>} mutated user data
   */
  // @ApiOperation({ summary: 'User verification: token verification' })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Return verified user',
  // })
  // @ApiResponse({
  //   status: HttpStatus.NOT_FOUND,
  //   description: 'User not found',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'Token is expire or Invalid Token',
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: 'No token is received',
  // })
  // @ApiHeader({
  //   name: 'authorization',
  //   description: 'Custom header',
  // })
  // @HttpCode(HttpStatus.OK)
  // @Post('verification')
  // public async accountVerification(@Headers() headers): Promise<IUser> {
  //   try {
  //     const token =
  //       headers.hasOwnProperty('authorization') && headers['authorization']
  //         ? headers['authorization']
  //         : '';
  //     return await this.service.accountVerification(token);
  //   } catch (err) {
  //     throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
  //       cause: new Error(err),
  //     });
  //   }
  // }

  // @Post('verification/otp')
  // public async accountVerificationOtp(@Body() data: OtpVerificationDto): Promise<IUser> {
  //   try {
  //     return await this.service.accountVerificationWithOtp(data.email, data.otp);
  //   } catch (err) {
  //     throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
  //       cause: new Error(err),
  //     });
  //   }
  // }

  // @ApiExcludeEndpoint()
  // @Get('verification')
  // public accountVerificationGet() {
  //   throw new MethodNotAllowedException('Method not allowed');
  // }

  // @ApiExcludeEndpoint()
  // @Put('verification')
  // public accountVerificationPut() {
  //   throw new MethodNotAllowedException('Method not allowed');
  // }

  // @ApiExcludeEndpoint()
  // @Patch('verification')
  // public accountVerificationPatch() {
  //   throw new MethodNotAllowedException('Method not allowed');
  // }

  // @ApiExcludeEndpoint()
  // @Delete('verification')
  // public accountVerificationDelete() {
  //   throw new MethodNotAllowedException('Method not allowed');
  // }

  /**
   * Generate link for user verification
   * @Body {EmailDTO} emailDTO the user given id to fetch
   * @returns {Promise<object>} queried new otp
   */
  // @ApiOperation({ summary: 'Generate link for user verification' })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Sent token generation message',
  // })
  // @ApiResponse({
  //   status: HttpStatus.NOT_FOUND,
  //   description: 'User not found',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'Invalid data',
  // })
  // @ApiHeader({
  //   name: 'authorization',
  //   description: 'Custom header',
  // })
  // @UsePipes(new ValidationPipe(false))
  // @UsePipes(new TrimPipe())
  // @Post('generate/link')
  // public async generateToken(
  //   @Headers() headers,
  //   @Body() data: EmailDto,
  // ): Promise<Record<any, any>> {
  //   try {
  //     const token =
  //       headers.hasOwnProperty('authorization') && headers['authorization']
  //         ? headers['authorization']
  //         : '';
  //     return await this.service.generateToken(data.email, token);
  //   } catch (err) {
  //     throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
  //       cause: new Error(err),
  //     });
  //   }
  // }

  // @ApiExcludeEndpoint()
  // @Get('generate/link')
  // public generateTokenGet() {
  //   throw new MethodNotAllowedException('Method not allowed');
  // }

  // @ApiExcludeEndpoint()
  // @Put('generate/link')
  // public generateTokenPut() {
  //   throw new MethodNotAllowedException('Method not allowed');
  // }

  // @ApiExcludeEndpoint()
  // @Patch('generate/link')
  // public generateTokenPatch() {
  //   throw new MethodNotAllowedException('Method not allowed');
  // }

  // @ApiExcludeEndpoint()
  // @Delete('generate/link')
  // public generateTokenDelete() {
  //   throw new MethodNotAllowedException('Method not allowed');
  // }
    

  /**
   * update user
   * @User {IUser} user
   * @Body {UserProfileDTO} UserProfileDTO
   * @returns {Promise<IUserProfile>} created user data
   */
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'user update' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return updated user.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @UsePipes(new NullValidationPipe())
  @UsePipes(new ValidationPipe(true))
  @UsePipes(new TrimPipe())
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  public async updateUser(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
    @User() user: IUser,
  ): Promise<IUser> {
    try {
      return this.service.update(id, data, user);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }

  @ApiExcludeEndpoint()
  @Post(':id')
  public updatePost() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Put(':id')
  public updatePut() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Delete(':id')
  public updateDelete() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  /**
   * Retrieves a particular user (Public Api)
   * @Param {string} profileId
   * @returns {Promise<IUser>} queried user data
   */
  @ApiOperation({ summary: 'Get user from id' })
  @ApiResponse({ status: 200, description: 'Return user information.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User Not found.',
  })
  @Get(':id')
  public async getUserById(@Param('id') id: string): Promise<IUser> {
    try {
      return await this.service.findOne(id);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }
}
