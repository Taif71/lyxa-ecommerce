import { OmitType } from '@nestjs/swagger';
import { ProductDto } from './product.dto';
import { IProduct } from '../interfaces';

export class UpdateProductDto
    extends OmitType(ProductDto, [
        'seller',
        'slug',
        'viewCount',
        'ratings',
        'cTime',
        'cBy',
        'uTime',
        'uBy'
    ] as const)
    implements Readonly<UpdateProductDto> {
    constructor(data?: IProduct) {
        super(data);
    }
}
