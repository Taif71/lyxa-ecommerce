import { OmitType } from '@nestjs/swagger';
import { ICategory } from '../interfaces';
import { CategoryDto } from './categories.dto';

export class UpdateCategoryDto
    extends OmitType(CategoryDto, [
        'parentCategory',
        'cTime',
        'cBy',
        'uTime',
        'uBy'
    ] as const)
    implements Readonly<UpdateCategoryDto> {
    constructor(data?: ICategory) {
        super(data);
    }
}
