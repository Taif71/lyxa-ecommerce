import {
    IsString,
    IsMongoId,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
    MediaDto,
    BaseDto
} from '../../common/dto';
import {
    IMedia,
} from '../../common/interfaces';
import { ICategory } from '../interfaces';

export class CategoryDto extends BaseDto implements Readonly<CategoryDto> {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsMongoId()
    parentCategory: string;

    @ApiProperty({
        type: MediaDto,
    })
    @ValidateNested({ each: true })
    @Type(() => MediaDto)
    image: IMedia;

    constructor(data?: ICategory) {
        super(data);
        if (data) {
            data.name && (this.name = data.name);
            data.parentCategory && (this.parentCategory = data.parentCategory);
            data.image && (this.image = data.image);
        }
    }
}
