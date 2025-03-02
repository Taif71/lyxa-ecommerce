import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { MediaProvider } from '../../common/mock/constant.mock';

export class ProviderDTO implements Readonly<ProviderDTO> {
  @ApiProperty({ enum: MediaProvider })
  @IsEnum(MediaProvider)
  @IsOptional()
  provider?: MediaProvider;
}
