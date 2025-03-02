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
  import { IMedia } from '../../common/interfaces';
  import { IProduct } from '../interfaces';
  import { AvaibilityStatus } from '../../common/mock';
  
  export class ProductDto extends BaseDto implements Readonly<ProductDto> {
    @ApiProperty()
    @IsMongoId()
    seller: string;
  
    @ApiProperty()
    @IsMongoId()
    category: string;
  
    @ApiProperty({ required: false })
    @IsMongoId()
    @IsOptional()
    subCategory?: string;
  
    @ApiProperty()
    @IsString()
    @MaxLength(100)
    title: string;
  
    @ApiProperty()
    @IsString()
    @MaxLength(100)
    slug: string;
  
    @ApiProperty()
    @IsString()
    @MaxLength(1000)
    description: string;
  
    @ApiProperty({ enum: AvaibilityStatus, required: false })
    @IsEnum(AvaibilityStatus)
    @IsOptional()
    status: AvaibilityStatus = AvaibilityStatus.AVAILABLE;
  
    @ApiProperty({ type: [MediaDto], required: false })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MediaDto)
    @IsOptional()
    images?: IMedia[];
  
    @ApiProperty({ type: [MediaDto], required: false })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MediaDto)
    @IsOptional()
    videos?: IMedia[];
  
    @ApiProperty({ default: 0 })
    @IsNumber()
    @Min(0)
    viewCount: number = 0;
  
    @ApiProperty()
    @IsNumber()
    @Min(0)
    ratings: number;
  
    @ApiProperty()
    @IsNumber()
    @Min(0)
    price: number;
  
    @ApiProperty()
    @IsNumber()
    @Min(0)
    stock: number;
  
    @ApiProperty({ default: false })
    @IsBoolean()
    isFeatured: boolean = false;
  
    @ApiProperty({ type: [String], required: false })
    @IsArray()
    @IsOptional()
    tags?: string[];
  
    @ApiProperty({
      type: Array,
      example: [{ variantName: 'Color', options: ['Red', 'Blue'] }],
      required: false,
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Object)
    @IsOptional()
    variations?: Array<{
      variantName: string;
      options: string[];
    }>;
  
    constructor(data) {
      super(data);
      if (data) {
        this.seller = data.seller;
        this.category = data.category;
        this.subCategory = data.subCategory;
        this.title = data.title;
        this.slug = data.slug;
        this.description = data.description;
        this.status = data.status || AvaibilityStatus.AVAILABLE;
        this.images = data.images;
        this.videos = data.videos;
        this.viewCount = data.viewCount || 0;
        this.ratings = data.ratings || 0;
        this.price = data.price;
        this.stock = data.stock;
        this.isFeatured = data.isFeatured || false;
        this.tags = data.tags || [];
        this.variations = data.variations || [];
      }
    }
  }
  