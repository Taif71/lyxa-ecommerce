import {
    Injectable,
    HttpStatus,
    HttpException,
    BadRequestException,
    NotAcceptableException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserProfileService } from './profile.service';
import {
    CreateUserDto,
    UserDto,
    UpdateUserDto,
    CreateUserProfileDto,
} from '../dto';
import { encodeToken, decodeToken } from '../../common/utils/helper';
import { IUser } from '../interfaces';
import { SCHEMA } from '../../common/mock';

/**
 * User Service
 */
@Injectable()
export class UsersService {
    private readonly password = 'oS1H+dKX1+OkXUu3jABIKqThi5/BJJtB0OCo';
    /**
     * Constructor
     * @param {Model<IUser>} model
     * @param {service<UserProfileService>} profileService
     */
    constructor(
        @InjectModel(SCHEMA.USER)
        private readonly model: Model<IUser>,
        private readonly profileService: UserProfileService,
    ) { }

    /**
     * Create a user with RegisterPayload fields
     * @param {CreateUserDto} data user payload
     * @returns {Promise<IUser>} created user data
     */
    async register(data: CreateUserDto): Promise<IUser> {
        try {
            const email = data.email.toLowerCase();
            const isExist = await this.model.findOne({
                email: email,
            });
            if (isExist) {
                return Promise.reject(
                    new NotAcceptableException(
                        `User already exist with the ${email}`,
                    ),
                );
            }
            const record = new UserDto({
                email: data.email.toLowerCase(),
                password: data.password,
                otp: Math.round(100000 + Math.random() * 900000),
                otpExpiresAt: Date.now() + 15 * 60 * 1000,
            });

            // const registerModel = new this.model(record);
            const newUser = await this.model.create(record);

            const token = {
                _id: newUser._id,
                email: record.email,
            };
            const updateRecord = new UserDto({
                emailProofToken: await encodeToken(token, this.password),
                emailProofTokenExpiresAt: Date.now() + 30 * 60 * 1000,
                cBy: newUser._id
            });
            await newUser.set(updateRecord).save();

            const profileData = new CreateUserProfileDto();
            if (data && data.hasOwnProperty('firstName')) {
                profileData.firstName =
                    data.hasOwnProperty('firstName') && data.firstName;
            }
            if (data && data.hasOwnProperty('lastName')) {
                profileData.lastName =
                    data.hasOwnProperty('lastName') && data.lastName;
            }
            await this.profileService.create(profileData, newUser);
            return newUser;
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
     * Verify a user account with verification token
     * @param {string} token
     * @returns {Promise<IUser>} verify user account
     */
    async accountVerification(token: string): Promise<IUser> {
        try {
            const decryptedJson = await decodeToken(token, this.password);
            const user = await this.model.findById(decryptedJson._id);
            if (!user) {
                return Promise.reject(new NotFoundException('Could not find user.'));
            }

            if (user && user.get('emailProofTokenExpiresAt')) {
                const now = Date.now();

                if (user.get('emailProofTokenExpiresAt') < now) {
                    return Promise.reject(new BadRequestException('Token is expire!'));
                } else if (user.get('emailProofToken') !== token) {
                    return Promise.reject(new BadRequestException('Invalid Token!'));
                } else {
                    await user
                        .set({
                            isVerified: true,
                        })
                        .save();
                }
            } else {
                return Promise.reject(
                    new UnauthorizedException('No token is received!'),
                );
            }
            return user;
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
     * Verify a user account with verification token
     * @param {string} token
     * @returns {Promise<IUser>} verify user account
     */
    async accountVerificationWithOtp(email: string, otp: number): Promise<IUser> {
        try {
            const user = await this.model.findOne({ email: email });
            if (!user) {
                return Promise.reject(new NotFoundException('Could not find user.'));
            }

            if (user && user.get('otpExpiresAt')) {
                const now = Date.now();

                if (user.get('otpExpiresAt') < now) {
                    return Promise.reject(new BadRequestException('Otp is expire!'));
                } else if (user.get('otp') !== otp) {
                    return Promise.reject(new BadRequestException('Invalid Otp!'));
                } else {
                    await user
                        .set({
                            isVerified: true,
                        })
                        .save();
                }
            } else {
                return Promise.reject(
                    new UnauthorizedException('No Otp is received!'),
                );
            }
            return user;
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
     * generate new verification token
     * @param {string} email
     * @param {string} oldToken
     * @returns {Promise<Record<any, any>>}
     */
    async generateToken(
        email: string,
        oldToken?: string,
    ): Promise<Record<any, any>> {
        try {
            if (!email && oldToken) {
                const decryptToken = await decodeToken(oldToken, this.password);
                email = decryptToken.email;
            }
            email = email.toLowerCase();
            const user = await this.model.findOne({ email });

            if (!user) {
                return Promise.reject(new NotFoundException('Could not find user.'));
            }

            const resetMinutes = 15;

            if (
                user.emailProofTokenExpiresAt >
                Date.now() + (resetMinutes - 1) * 60 * 1000
            )
                return Promise.reject(
                    new BadRequestException('You can generate token after 1 minute'),
                );

            const token = {
                _id: user._id,
                email: user.email,
            };
            const data = new UserDto({
                emailProofToken: await encodeToken(token, this.password),
                emailProofTokenExpiresAt: Date.now() + resetMinutes * 60 * 1000,
                uBy: user._id
            });
            await user.set(data).save();
            return { data: '', message: 'Token Generated Successfully !' };
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
     * generate password reset token
     * @param {string} email
     * @returns {Promise<object>}
     */
    async generatePasswordResetToken(email: string): Promise<Record<any, any>> {
        try {
            const userEmail = email.toLowerCase();
            const user = await this.model.findOne({ email: userEmail });

            if (!user) {
                return Promise.reject(new NotFoundException('User not found.'));
            }

            const resetMinutes = 15;

            if (
                user.passwordResetTokenExpiresAt >
                Date.now() + (resetMinutes - 1) * 60 * 1000
            )
                return Promise.reject(
                    new BadRequestException('You can generate token after 1 minute'),
                );

            const token = {
                _id: user._id,
                email: user.email,
            };
            const data = new UserDto({
                passwordResetToken: await encodeToken(token, this.password),
                passwordResetTokenExpiresAt: Date.now() + resetMinutes * 60 * 1000,
                uBy: user._id
            });
            await user.set(data).save();
            return { data: '', message: 'Token Generated Successfully !' };
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
     * reset user password using token
     * @returns {Promise<object>}
     * @param {string} token
     * @param {string} newPassword
     */
    public async forgetPassword(
        token: string,
        newPassword: string,
    ): Promise<any> {
        try {
            const decryptedJson = await decodeToken(token, this.password);
            const user = await this.model.findById(decryptedJson._id);
            if (!user) {
                return Promise.reject(new NotFoundException('User not found.'));
            }

            if (user && user.get('passwordResetTokenExpiresAt')) {
                const now = Date.now();

                if (user.get('passwordResetTokenExpiresAt') < now) {
                    return Promise.reject(new BadRequestException('Token is expire!'));
                } else if (user.get('passwordResetToken') !== token) {
                    return Promise.reject(new BadRequestException('Invalid Token!'));
                } else {
                    const passwordIsValid = bcrypt.compareSync(
                        newPassword,
                        user.password,
                    );

                    if (passwordIsValid) {
                        return Promise.reject(
                            new BadRequestException('Already used this password'),
                        );
                    } else {
                        const data = new UserDto({
                            password: newPassword,
                            passwordResetTokenExpiresAt: Date.now() - 365 * 24 * 60 * 60 * 1000,
                            uBy: decryptedJson._id
                        })
                        return await user.set(data).save();
                    }
                }
            } else {
                return Promise.reject(new BadRequestException('Token is not found!'));
            }
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
     * reset user password using token
     * @param {string} id
     * @param {string} currentPassword
     * @param {string} newPassword
     * @returns {Promise<object>}
     */
    public async resetPassword(
        id: string,
        currentPassword: string,
        newPassword: string,
    ): Promise<any> {
        try {
            const user = await this.model.findById(id);
            if (!user) {
                return Promise.reject(new NotFoundException('Could not find user.'));
            }

            if (user && user.get('password')) {
                const passwordIsValid = bcrypt.compareSync(
                    currentPassword,
                    user.password,
                );

                const passwordIsSame = currentPassword === newPassword;

                if (!passwordIsValid) {
                    return Promise.reject(
                        new BadRequestException('Current password is not matched'),
                    );
                } else if (passwordIsSame) {
                    return Promise.reject(
                        new BadRequestException('Already used this password'),
                    );
                } else {
                    const data = new UserDto({
                        password: newPassword,
                        uBy: user._id
                    })
                    return await user.set(data).save();
                }
            } else {
                return Promise.reject(
                    new BadRequestException('User information is not found'),
                );
            }
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
     * update user by id
     * @param { string } id
     * @param { UpdateUserDto } data
     * @param { IUser } user
     * @returns {Promise<IUser>} mutated user data
     */
    async update(
        id: string,
        data: UpdateUserDto,
        user: IUser,
    ): Promise<IUser> {
        try {
            const userData = await this.model.findOne({
                _id: id,
            });
            if (!userData) {
                return Promise.reject(new NotFoundException('User not found.'));
            }

            const userDto = new UserDto({
                ...data,
                uBy: user._id
            });
            data?.timezone && (userDto.timezone = data.timezone);

            return await userData.set(userDto).save();
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
     * find user
     * @param {string} id
     * @returns {Promise<IUser>}
     */
    async findOne(id: string): Promise<IUser> {
        try {
            return await this.model
                .findOne({ _id: id })
                .populate([
                    {
                        path: 'profile',
                    }
                ])
                .exec();
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
}
