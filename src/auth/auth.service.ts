import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUser } from '../users/interfaces/user.interface';
import { JwtPayload } from './interfaces/jwt.payload';
import { AuthDTO } from './dto/auth.dto';
import { SCHEMA } from '../common/mock';
import 'dotenv/config';

@Injectable()
export class AuthService {
  /**
   * Constructor
   * @param {Model<IUser>} userModel
   * @param {JwtService} jwtService
   */
  constructor(
    @InjectModel(SCHEMA.USER) private readonly userModel: Model<IUser>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Fetches a user from database by mongoId
   * @param {AuthDTO} loginDto
   * @returns {Promise<IUser>} queried user data
   */
  private async validate(loginDto: AuthDTO): Promise<IUser> {
    try {
      const email = loginDto.email.toLowerCase();

      return await this.userModel
        .findOne({ email: email })
        .populate('profile')
        .exec();
    } catch (error) {
      return;
    }
  }

  /**
   * Create a JWT-Token for authentication and return user data
   * @param {AuthDTO} loginDto
   * @returns Promise<any | { status: number; message: string } queried user data
   */
  public async login(
    loginDto: AuthDTO,
  ): Promise<any | { status: number; message: string }> {
    return this.validate(loginDto).then((userData) => {
      if (!userData) {
        throw new NotFoundException('Authentication failed. User not found');
      }

      const passwordIsValid = bcrypt.compareSync(
        loginDto.password,
        userData.password,
      );

      if (!passwordIsValid == true) {
        throw new UnauthorizedException('Unauthorized access: Wrong password');
      }

      if (userData.isDeleted) {
        throw new ForbiddenException('User is deleted');
      }

      if (!userData.isActive) {
        throw new ForbiddenException('User account is on hold');
      }

      if (
        loginDto &&
        loginDto.hasOwnProperty('isAdmin') &&
        loginDto.isAdmin !== userData.isAdmin
      ) {
        throw new ForbiddenException('Permission Denied: User is not an admin');
      }

      const userProfile = userData.profile;

      const payload = {
        _id: userData._id,
        email: userData.email,
        isVerified: userData.isVerified,
        isAdmin: userData.isAdmin,
        isSuperAdmin: userData.isSuperAdmin,
        firstName: userProfile && userProfile.firstName,
        middleName: userProfile && userProfile.middleName,
        lastName: userProfile && userProfile.lastName,
        profilePercentage: userProfile && userProfile.profilePercentage,
      };

      const accessToken = this.jwtService.sign(payload);

      return {
        expiresIn: 7 * 24 * 60 * 60 * 1000,
        token: accessToken,
        user: payload,
        status: HttpStatus.OK,
      };
    });
  }

  /**
   * Validate a user with the JWTtoken for authentication
   * This will be used when the user has already logged in and has a JWT
   * @param {JwtPayload} payload
   * @returns  jwtToken
   */
  public async validateUserByJwt(payload: JwtPayload) {
    const user = await this.userModel.findOne({ email: payload.email }).exec();

    if (!user) {
      throw new UnauthorizedException();
    }
    return this.createJwtPayload(user);
  }

  protected createJwtPayload(user) {
    const data: JwtPayload = {
      email: user.email,
    };

    const jwt = this.jwtService.sign(data);

    return {
      expiresIn: 7 * 24 * 60 * 60 * 1000,
      token: jwt,
    };
  }

  public retrieveUserFromToken(token) {
    return this.jwtService.decode(token);
  }
}
