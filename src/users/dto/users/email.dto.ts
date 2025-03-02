import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailDto implements Readonly<EmailDto> {
  @ApiProperty({
    example: 'john@mail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
