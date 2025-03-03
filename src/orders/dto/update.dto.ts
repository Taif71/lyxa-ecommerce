import { OmitType } from '@nestjs/swagger';
import { OrderDto } from './order.dto';
import { IOrder } from '../interfaces';

export class UpdateOrderDto
    extends OmitType(OrderDto, [   
        'isActive',
        'timezone',
        'isDeleted',     
        'cTime',
        'cBy',
        'uTime',
        'uBy'
    ] as const)
    implements Readonly<UpdateOrderDto> {
    constructor(data?: IOrder) {
        super(data);
    }
}
