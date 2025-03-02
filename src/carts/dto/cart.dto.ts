import {
    IsMongoId,
    IsArray,
    IsNumber,
    Min,
    IsEnum,
    IsBoolean,
    ValidateNested,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { ApiProperty } from '@nestjs/swagger';
import { CartStatus } from 'src/common/mock';
import { BaseDto } from 'src/common/dto';
  
  export class CartItemDto {
    @ApiProperty()
    @IsMongoId()
    product: string;
  
    @ApiProperty()
    @IsNumber()
    @Min(1)
    quantity: number;
  
    @ApiProperty()
    @IsNumber()
    @Min(0)
    price: number;

    constructor(data) {
        if (data) {
          this.product = data.product;
          this.quantity = data.quantity || 1;
          this.price = data.price || 0;
        }
      }
  }
  
  export class CartDto extends BaseDto {
    @ApiProperty()
    @IsMongoId()
    user: string;
  
    @ApiProperty({ type: [CartItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CartItemDto)
    items: CartItemDto[];
  
    @ApiProperty()
    @IsNumber()
    @Min(0)
    totalPrice: number;
  
    @ApiProperty({ enum: CartStatus })
    @IsEnum(CartStatus)
    status: CartStatus;

    constructor(data) {
        super(data);
        if (data) {
          this.user = data.user;
          this.items = data.items
            ? data.items.map((item) => new CartItemDto(item))
            : [];
          this.totalPrice = data.totalPrice || 0;
          this.status = data.status || CartStatus.ACTIVE;
        }
      }
  }
  