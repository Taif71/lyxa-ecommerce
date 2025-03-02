import {
    Controller,
    Body,
    UseGuards,
    UsePipes,
    UploadedFiles,
    Param,
    Get,
    Post,
    Put,
    Patch,
    Delete,
    Query,
    HttpStatus,
    HttpException,
    MethodNotAllowedException,
} from '@nestjs/common';
import { UserProfileService } from '../services';
import {
    UpdateUserProfileDto,
    SearchUserProfileDto,
    UserFileUploadDto,
} from '../dto';
import { IUserProfiles, IUser, IUserProfile } from '../interfaces';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ValidationPipe, TrimPipe, NullValidationPipe } from '../../common/pipes';
import { User } from '../../common/decorators/user.decorator';
import {
    ApiBearerAuth,
    ApiResponse,
    ApiOperation,
    ApiTags,
    ApiHeader,
    ApiConsumes,
    ApiBody,
    ApiExcludeEndpoint,
} from '@nestjs/swagger';

/**
 * User-profile Controller
 */
@ApiTags('Profile')
@ApiResponse({
    status: HttpStatus.METHOD_NOT_ALLOWED,
    description: 'Method not allowed',
})
@ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server Error!',
})
@Controller('profiles')
export class UsersProfileController {
    /**
     * Constructor
     * @param {UserProfileService} service
     */
    constructor(private readonly service: UserProfileService) { }

    /**
     * update user profile by user
     * @User {IUser} user
     * @Body {UserProfileDto} data
     * @returns {Promise<IUserProfile>} created user data
     */
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer Token',
    })
    @ApiOperation({ summary: 'user update by user' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Return updated user.' })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'User not found',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid data',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UserFileUploadDto })
    @UseGuards(JwtAuthGuard)
    @Put()
    public async updateUserProfilePut(
        @User() user: IUser,
        @Body() data: UpdateUserProfileDto,
        @UploadedFiles()
        files: {
            profilePic?: Express.Multer.File[];
            coverPic?: Express.Multer.File[];
        },
    ): Promise<IUserProfile> {
        try {
            return await this.service.update(
                data,
                user,
            );
        } catch (err) {
            throw new HttpException(
                err,
                err.status || HttpStatus.BAD_REQUEST,
                {
                    cause: new Error(err)
                }
            );
        }
    }

    @ApiBearerAuth()
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer Token',
    })
    @ApiOperation({ summary: 'user update by user' })
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
    @Patch()
    public async updateUserProfile(
        @User() user: IUser,
        @Body() data: UpdateUserProfileDto,
    ): Promise<IUserProfile> {
        try {
            return await this.service.update(data, user);
        } catch (err) {
            throw new HttpException(
                err,
                err.status || HttpStatus.BAD_REQUEST,
                {
                    cause: new Error(err)
                }
            );
        }
    }


    @ApiExcludeEndpoint()
    @Post()
    public updatePost() {
        throw new MethodNotAllowedException('Method not allowed');
    }

    @ApiExcludeEndpoint()
    @Delete()
    public updateDelete() {
        throw new MethodNotAllowedException('Method not allowed');
    }

    /**
     * find all userProfile
     * @returns {Promise<IUserProfiles>}
     */
    @ApiOperation({ summary: 'Get all user profiles' })
    @UsePipes(new ValidationPipe(true))
    @Get()
    public findAll(
        @Query() query: SearchUserProfileDto,
    ): Promise<IUserProfiles> {
        try {
            return this.service.findAll(query);
        } catch (err) {
            throw new HttpException(
                err,
                err.status || HttpStatus.BAD_REQUEST,
                {
                    cause: new Error(err)
                }
            );
        }
    }


    /**
     * count all userProfile
     * @returns {Promise<number>}
     */
    @ApiOperation({ summary: 'Count all user profiles' })
    @UsePipes(new ValidationPipe(true))
    @Get('count')
    public count(@Query() query: SearchUserProfileDto): Promise<number> {
        try {
            return this.service.count(query);
        } catch (err) {
            throw new HttpException(
                err,
                err.status || HttpStatus.BAD_REQUEST,
                {
                    cause: new Error(err)
                }
            );
        }
    }
    @ApiExcludeEndpoint()
    @Post('count')
    public countPost() {
        throw new MethodNotAllowedException('Method not allowed');
    }

    @ApiExcludeEndpoint()
    @Put('count')
    public countPut() {
        throw new MethodNotAllowedException('Method not allowed');
    }

    @ApiExcludeEndpoint()
    @Patch('count')
    public countPatch() {
        throw new MethodNotAllowedException('Method not allowed');
    }

    @ApiExcludeEndpoint()
    @Delete('count')
    public countDelete() {
        throw new MethodNotAllowedException('Method not allowed');
    }

    /**
     * Retrieves a particular user (Public Api)
     * @Param {string} id
     * @returns {Promise<IUserProfile>} queried user data
     */
    @ApiOperation({ summary: 'Get user from id' })
    @ApiResponse({ status: 200, description: 'Return user information.' })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'User Not found.',
    })
    @Get(':id')
    public async getUserProfileById(
        @Param('id') id: string,
    ): Promise<IUserProfile> {
        try {
            return await this.service.findOne(id, null);
        } catch (err) {
            throw new HttpException(
                err,
                err.status || HttpStatus.BAD_REQUEST,
                {
                    cause: new Error(err)
                }
            );
        }
    }

    @ApiExcludeEndpoint()
    @Delete(':id')
    public getUserByIdDelete() {
        throw new MethodNotAllowedException('Method not allowed');
    }
}
