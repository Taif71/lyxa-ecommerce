import { OmitType } from '@nestjs/swagger';
import { CartDto } from './cart.dto';

export class CreateCartDto
    extends OmitType(CartDto, [
        'user',
        'isActive',
        'isDeleted',
        'cTime',
        'cBy',
        'uTime',
        'uBy'
    ] as const)
    implements Readonly<CreateCartDto> {
    constructor(data) {
        super(data);
    }
}
