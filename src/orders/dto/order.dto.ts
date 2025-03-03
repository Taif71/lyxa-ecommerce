import {
    IsMongoId,
    IsString,
    ValidateNested,
    IsArray,
    IsEnum,
    IsBoolean,
    IsNumber,
    Min,
    MaxLength,
    IsOptional,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { ApiProperty } from '@nestjs/swagger';
  import { MediaDto, BaseDto } from '../../common/dto';
  
  
  import { OrderStatus, PaymentStatus } from '../schemas/orders.schema';
  
  export class OrderDto extends BaseDto implements Readonly<OrderDto> {
    @ApiProperty()
    @IsMongoId()
    customer: string;
  
    @ApiProperty()    
    items: Object[];
  
    @ApiProperty({ required: false })    
    totalPrice: number;
  
    @ApiProperty()
    @IsEnum(OrderStatus)    
    status: OrderStatus;
  
    @ApiProperty()
    @IsEnum(PaymentStatus)
    paymentStatus: PaymentStatus;
  
    @ApiProperty()
    @IsString()
    @MaxLength(1000)
    shippingAddress: string;
  
    @ApiProperty()
    @IsString()
    @MaxLength(1000)
    billingAddress: string;
  
    @ApiProperty({ required: false })    
    @IsOptional()
    trackingNumber?: string;
  
    @ApiProperty({ required: false })    
    deliveredAt?: Date;
  
    @ApiProperty({ required: false })    
    canceledAt?: Date;
  
    @ApiProperty() 
    @IsOptional()   
    paymentDetails?: Object;
    
  
    constructor(data) {
      super(data);
      if (data) {
        this.customer = data.customer;
        this.items = data.items;
        this.totalPrice = data.totalPrice;
        this.status = data.status;
        this.paymentStatus = data.paymentStatus;
        this.shippingAddress = data.shippingAddress;       
        this.billingAddress = data.billingAddress;
        this.trackingNumber = data.trackingNumber;
        this.deliveredAt = data.deliveredAt || 0;
        this.canceledAt = data.canceledAt || 0;
        this.paymentDetails = data.paymentDetails;       
      }
    }
  }
  