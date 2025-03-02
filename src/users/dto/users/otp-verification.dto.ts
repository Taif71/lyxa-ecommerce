import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OtpVerificationDto implements Readonly<OtpVerificationDto> {
  @ApiProperty({
    example: 'john@mail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  otp: number;
}
