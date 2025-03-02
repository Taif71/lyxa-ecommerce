import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { SearchQueryDto } from '../../../common/dto';

export class SearchUserProfileDto
  extends SearchQueryDto
  implements Readonly<SearchUserProfileDto>
{
  @ApiProperty({ required: false })
  @IsOptional()
  distance: number;

  @ApiProperty({ required: false })
  @IsOptional()
  lat: number;

  @ApiProperty({ required: false })
  @IsOptional()
  lng: number;
}
