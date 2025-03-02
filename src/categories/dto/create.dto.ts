import { OmitType } from '@nestjs/swagger';
import { ICategory } from '../interfaces';
import { CategoryDto } from './categories.dto';

export class CreateCategoryDto
    extends OmitType(CategoryDto, [
        'isActive',
        'isDeleted',
        'cTime',
        'cBy',
        'uTime',
        'uBy'
    ] as const)
    implements Readonly<CreateCategoryDto> {
    constructor(data?: ICategory) {
        super(data);
    }
}
