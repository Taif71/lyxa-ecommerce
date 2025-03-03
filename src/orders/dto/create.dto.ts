import { OmitType } from '@nestjs/swagger';
import { OrderDto } from './order.dto';
import { IOrder } from '../interfaces';

export class CreateOrderDto
    extends OmitType(OrderDto, [        
        'isActive',
        'isDeleted',
        'cTime',
        'cBy',
        'uTime',
        'uBy'
    ] as const)
    implements Readonly<CreateOrderDto> {
    constructor(data?: IOrder) {
        super(data);
    }
}
