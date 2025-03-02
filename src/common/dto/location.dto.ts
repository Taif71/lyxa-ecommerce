import {
  IsArray,
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LocationDto implements Readonly<LocationDto> {
  @ApiProperty()
  @MinLength(2)
  @MaxLength(300)
  @IsString()
  address: string;

  @ApiProperty()
  @IsMongoId()
  city: string;

  @ApiProperty()
  @IsMongoId()
  state: string;

  @ApiProperty()
  @IsMongoId()
  country: string;

  @ApiProperty()
  @IsString()
  zipCode: string;

  @ApiProperty()
  lat: number;

  @ApiProperty()
  lng: number;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  coordinates: number[];

  @ApiProperty()
  isDeleted: boolean;
}
