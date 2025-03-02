import {
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsString,
  IsBoolean,
} from 'class-validator';

export class AuthDTO {
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  readonly password: string;

  @IsBoolean()
  readonly isProvider: boolean;

  @IsBoolean()
  readonly isAdmin: boolean;
}
