import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import {
  UsersController,
  UsersProfileController
} from './controllers';
import {
  UserProfileService,
  UsersService
} from './services';
import { UserSchema, UserProfileSchema } from './schemas';
import { SCHEMA } from '../common/mock';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: SCHEMA.USER, schema: UserSchema },
      { name: SCHEMA.USER_PROFILE, schema: UserProfileSchema },
    ]),
    JwtModule.register({
      secret: process.env.SECRET_KEY_JWT,
      signOptions: {
        expiresIn: 24 * 60 * 60 * 1000, // 1 days,
      },
    }),
  ],
  controllers: [
    UsersController,
    UsersProfileController
  ],
  providers: [
    UsersService,
    UserProfileService,
  ]
})
export class UsersModule { }
