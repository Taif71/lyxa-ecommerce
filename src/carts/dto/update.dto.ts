import { OmitType } from '@nestjs/swagger';
import { CartDto } from './cart.dto';

export class UpdateCartDto
    extends OmitType(CartDto, [
        'user',
        'cTime',
        'cBy',
        'uTime',
        'uBy'
    ] as const)
    implements Readonly<UpdateCartDto> {
    constructor(data) {
        super(data);
    }
}
