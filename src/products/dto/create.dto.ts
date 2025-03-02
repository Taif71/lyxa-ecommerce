import { OmitType } from '@nestjs/swagger';
import { ProductDto } from './product.dto';
import { IProduct } from '../interfaces';

export class CreateProductDto
    extends OmitType(ProductDto, [
        'seller',
        'slug',
        'status',
        'viewCount',
        'ratings',
        'isActive',
        'isDeleted',
        'cTime',
        'cBy',
        'uTime',
        'uBy'
    ] as const)
    implements Readonly<CreateProductDto> {
    constructor(data?: IProduct) {
        super(data);
    }
}
